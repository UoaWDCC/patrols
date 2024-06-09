import axios from 'axios';
import { google } from 'googleapis';
import { Request, Response } from 'express';
import { createGetConfig, createPostConfig } from '../auth_util/gmailReqUtil';
import { any } from 'zod';
import { env } from 'process';

let isGood = 0
/**
 * After create a oAuth credential in google cloud project using our cpnz email,
 * it will generate three property as shown in 'oAuth2Client' below
 */
const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI, // I am really not sure whether this redirect url applicable in our case, but seems to be required using oAuth, currently set to https://developers.google.com/oauthplayground
);

const cpnzEmail = process.env.CPNZ_EMAIL_TEST; //this is our cpnz email used for sending to ECC

/**
 * https://developers.google.com/oauthplayground
 * Go to above website, click on the gear icon on the top right corner
 * copy client ID and client secret from the google cloud project oAuth Credential and save
 * Go to the panel at LHS
 * select the api access we want to grant our project to and authorize
 * then exchange authorization code for tokens
 * and copy the refresh token to .env and will be used here.
 */
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const saveHistoryIdInDb = (historyId: string) => {
    console.log("History ID: " + historyId)
}

const storeEventIdInDb = async (eventId: string, patrolId: string, logOnId: string) => {
    //store....
    console.log('\n');
    console.log("store the following info in db")
    console.log("eventId: " + eventId);
    console.log("patrolId: " + patrolId);
    console.log("logOnId: " + logOnId);

    return true;
}

const retrievePatrolIdAndLogOnId = (subject: string) => {

    console.log(subject)

    const extractIds = (value: string): { patrolId: string; shiftId: string } | null => {
        const regex = /CPNZ - Log On - Patrol ID: (?<patrolId>\d+) - Shift ID: (?<shiftId>\d+)/; // This format is in our control, so it would be quite predictable.
        const match = value.match(regex);

        if (match && match.groups) {
            const { patrolId, shiftId } = match.groups;
            return { patrolId, shiftId };
        }

        return null;
    };

    if (!subject) {
        return null;
    }

    const ids = extractIds(subject)
    return ids;
}

const traverseAllEmailParts = (parts: any) => {

    let eventId;

    if (parts && parts.length > 0) {
        for (let i = 0; i < parts.length; i++) {
            const thisPartObj = parts[i]
            const body = thisPartObj.body
            const innerParts = thisPartObj.parts

            //for a email that the part directly contains a body message
            if (body.size && body.size > 0) {
                const actualBody = body.data

                if (actualBody) {
                    eventId = retrieveEventId(actualBody)
                }
            }

            if (eventId) return eventId

            //for a email that the parts are hide inside a outer parts, where the actual content splited into several sub-parts
            if (innerParts && innerParts.length > 0) {
                innerParts.forEach((element: any) => {
                    if (element.body.data) {
                        const actualBody = element.body.data
                        eventId = retrieveEventId(actualBody)

                        if (eventId) return eventId
                    }
                });
            }
        }
    }
}
const retrieveEventId = (emailContent: string) => {

    const decodedBuffer = Buffer.from(emailContent, 'base64');
    const actualBodyInText = decodedBuffer.toString('utf-8');
    const eventNoPattern = /[Pp]\d{7}/;
    const eventNoMatch = actualBodyInText.match(eventNoPattern);
    const eventNo = eventNoMatch ? eventNoMatch[0] : null;

    return eventNo;
}

/**
 * 
 * @param messageId 
 * @returns 
 */
const getSingleMails = async (messageId: string) => {
    try {
        const url = `https://gmail.googleapis.com/gmail/v1/users/${cpnzEmail}/messages/${messageId}`;
        const { token } = await oAuth2Client.getAccessToken();

        let patrolId;
        let eventId;
        let logOnId;


        if (token) {
            const config = createGetConfig(url, token);
            const response = await axios(config);

            const headers = response.data.payload.headers

            const findSubjectHeader = (headers: Array<any>): { name: string; value: string } | undefined => {
                return headers.find((header: any) => header.name === 'Subject');
            }

            const subject = findSubjectHeader(headers)

            if (subject) {
                const subjectContent = subject.value
                const ids = retrievePatrolIdAndLogOnId(subjectContent)

                if (ids?.patrolId || ids?.shiftId) {
                    patrolId = ids.patrolId;
                    logOnId = ids.shiftId
                }
            }

            // event ID:
            const parts = response.data.payload.parts

            eventId = traverseAllEmailParts(parts)


            if (!eventId || !patrolId || !logOnId) {
                throw new Error("Failed to fetch Event ID or Patrol ID or LogOn ID")
            }

            const successfullyStored = await storeEventIdInDb(eventId, patrolId, logOnId)

            if (!successfullyStored) {
                console.log("failed to store ids info")
                return null
            }

            //once we store all correct infor in DB, we change this email's lable from UNREAD to READ 
            const urlForChangeLabel = `https://gmail.googleapis.com/gmail/v1/users/${cpnzEmail}/messages/${messageId}/modify`;
            const reqBody = {
                "removeLabelIds": [
                    'UNREAD'
                ]
            }

            const postConfig = createPostConfig(urlForChangeLabel, token, reqBody);
            const markReadResponse = await axios(postConfig);

            if (markReadResponse.status === 200) {
                isGood++;
            }

        } else {
            console.log('error: no token')
        }
    } catch (error) {
        console.error(error);

    }
}

/**
 * Lists the history of all changes to the given mailbox. 
 * History results are returned in chronological order (increasing historyId).
 * 
 * If the trigger function failed, we might need to periodically call this function to
 * retrieve the email since @param startedHistoryId til current.
 * 
 * A historyId is typically valid for at least a week, but in some rare circumstances may be valid for only a few hours
 * If you receive an HTTP 404 error response, your application should perform a full sync. 
 * 
 * Therefore, we might need to periodically call getMails() as well
 */

const getHistoryRecords = async (startedHistoryId: string) => {
    try {
        startedHistoryId = '278156'; //'278156', '278090', '278093'
        const { token } = await oAuth2Client.getAccessToken();

        const url = `https://gmail.googleapis.com/gmail/v1/users/${cpnzEmail}/history?startHistoryId=${startedHistoryId}`;

        if (token) {
            const config = createGetConfig(url, token);
            const response = await axios(config);
            console.log(response.data);
            const messagesAdded = response.data.history[0].messagesAdded

            if (messagesAdded && messagesAdded.length > 0) {
                console.log(`\n`)
                console.log('New Messages:  -----------------')
                console.log(`\n`)
                console.log(messagesAdded)
                const latestMessageId = messagesAdded[0].message.id
                if (latestMessageId) {
                    console.log(`\n`)
                    console.log('New Message[0]:  -----------------')
                    console.log('Fetched using history call')
                    console.log(`\n`)
                    await getSingleMails(latestMessageId)
                }
            }
        } else {
            throw new Error('Unable to get access token')
        }
    } catch (error) {
        console.error(error);
    }
}

/**
 * 
 * @param req 
 * @param res 
 */
const getMails = async (req: Request, res: Response): Promise<void> => {

    try {
        const url = `https://gmail.googleapis.com/gmail/v1/users/${cpnzEmail}/messages?q=is:unread&maxResults=5`;
        const { token } = await oAuth2Client.getAccessToken();
        if (token) {
            const config = createGetConfig(url, token);
            const response = await axios(config);
            const messages = response.data.messages

            for (let i = 0; i < messages.length; i++) {
                const historyID = await getSingleMails(messages[i].id)

                if (i === 0 && historyID) {
                    //save the historyID to DB means latest message
                    saveHistoryIdInDb(historyID)
                }

                console.log('isgood: ' + isGood)
            }

            res.status(200).json(response.data);

        } else {
            res.status(500).send('Unable to get access token');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}


/**
 * This is not working yet, insufficient scope or unauthorised states return by the api call, finding a way to work this around now
 * 
 * Reliability:
 * Typically all notifications should be delivered reliably within a few seconds; however in some extreme situations
 * notifications may be delayed or dropped. Make sure to handle this possibility gracefully, so that the application
 * still syncs even if no push messages are received. For example, fall back to periodically calling <history.list> after
 * a period with no notifications for a user.
 * @param req 
 * @param res 
 */
const watchMails = async (req: Request, res: Response): Promise<void> => {
    try {

        const { token } = await oAuth2Client.getAccessToken();

        const url = `https://www.googleapis.com/gmail/v1/users/${cpnzEmail}/watch`;
        const data = {
            topicName: "projects/cpnztestproj/topics/cpnzTestTopic",
            labelIds: ["INBOX"],
            labelFilterBehavior: "INCLUDE",
        };

        if (token) {
            const config = createPostConfig(url, token, data);
            const response = await axios.request(config);
            res.status(200).json(response.data);
        } else {
            res.status(500).json('Unable to get access token');
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json('An unknown error occurred');
        }
    }
}


export { getMails, watchMails };
