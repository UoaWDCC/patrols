import axios from 'axios';
import { google } from 'googleapis';
import { Request, Response } from 'express';
import { createGetConfig, createPostConfig } from '../gmail_util/gmailReqUtil';
import prisma from '../db/database';
import { listenForMessages } from '../gmail_util/listenToMessage';
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

const subscriptionNameOrId: string = process.env.GOOGLE_CLOUD_SUB_ID ?? '';

listenForMessages(subscriptionNameOrId);

const saveHistoryIdInDb = async (historyId: bigint) => {

    const storeHistoryId = await prisma.email_history_dev.update({
        where: {
            id: 1
        },
        data: {
            history_id: historyId, // in the schema, event_no is a int, should be string isnt it
        },
    })

    if (!storeHistoryId) {
        throw new Error('Unable to store history ID in DB');
    }

    console.log(`\n`)
    console.log("Store History ID: " + historyId)
}

const storeEventIdInDb = async (eventId: string, patrolId: string, logOnId: string) => {
    //store....

    try {
        console.log('\n');
        console.log("store the following info in db")
        console.log("eventId: " + eventId);
        console.log("patrolId: " + patrolId);
        console.log("logOnId: " + logOnId);

        const patrolIdBigInt = parseInt(patrolId);
        const logOnIdInt = parseInt(logOnId)

        /**
         * fetch event id first is because everytime we receive a new email, we will mark that
         * email as READ, so when full sync is required, we dont need to read that email again, and
         * gmail watch() function will detect we remove the UNREAD label of that email and hence a
         * new history ID will be generated and notify the subscription (trigger function) again,
         * even though there is only one email received.
         **/
        const fetchEventId = await prisma.shift.findUnique({
            where: {
                patrol_id: patrolIdBigInt,
                id: logOnIdInt
            },
            select: {
                event_no: true,
            },
        })

        const eventIdInDB: string | null | undefined = fetchEventId?.event_no

        if(eventIdInDB != null || eventIdInDB != undefined) {
            console.log(`Event ID is already in DB for this shift: ${logOnIdInt}`)
            return true
        }

        const storeEventId = await prisma.shift.update({
            where: {
                patrol_id: patrolIdBigInt,
                id: logOnIdInt
            },
            data: {
                event_no: eventId, // in the schema, event_no is a int, should be string isnt it
            },
        })

        if (!storeEventId) {
            throw new Error('Unable to store event ID in DB');
        }

        return true;

    } catch (error) {
        throw error;
    }
}

const retrievePatrolIdAndLogOnId = (subject: string) => {

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

    let eventId = undefined;

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
                innerParts.forEach((part: any) => {
                    const actualBody = part.body.data
                    if (actualBody) {
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
    const eventNo = eventNoMatch ? eventNoMatch[0] : undefined;

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
                throw new Error(`Error: At least one required ID is missing in the email message.\nRequire: [event ID, Patrol ID, Logon ID]`)
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

            if (!(markReadResponse.status === 200)) {
                throw new Error('Failed to make this email message as READ')
            }

            const successfullyStored = await storeEventIdInDb(eventId, patrolId, logOnId)

            if (!successfullyStored) {
                throw new Error("Failed to store ids info in DB")
            }

            const historyID = response.data.historyId
            return historyID;

        } else {
            console.log('error: no token')
        }
    } catch (error: any) {
        console.log(error.message);
    }
}

/**
 * 
 * Lists the history of all changes to the given mailbox. 
 * History results are returned in chronological order (increasing historyId).
 * 
 * If the trigger function failed, we might need to periodically call this function to
 * retrieve the email since @param startedHistoryId to present.
 * 
 * #From gmail api doc: A historyId is typically valid for at least a week, but in some rare
 * circumstances may be valid for only a few hours
 * If you receive an HTTP 404 error response, your application should perform a full sync. 
 * 
 * Therefore, we might need to periodically call getMails() as well
 * 
 */

const getHistoryRecords = async (startedHistoryId: bigint) => {
    try {
        // startedHistoryId = '285074'; //'278156', '278090', '278093'
        const { token } = await oAuth2Client.getAccessToken();

        const url = `https://gmail.googleapis.com/gmail/v1/users/${cpnzEmail}/history?startHistoryId=${startedHistoryId}`;

        if (token) {
            const config = createGetConfig(url, token);
            const response = await axios(config);
            const histories = response.data.history

            const traverseHistories = async (histories : Array<object>) => {
                if (histories && histories.length > 0) {
                    histories.forEach((history: any) => {
                        const messagesAdded = history.messagesAdded
                        if (messagesAdded && messagesAdded.length > 0) {
                            messagesAdded.forEach(async (item: any) => {
                                const messageId = item.message.id
                                await getSingleMails(messageId)
                            });
                        }
                    });
                }

                return true;
            }

            const finishFetchingIds = await traverseHistories(histories);

            if(finishFetchingIds) {
                const newHistoryiD = response.data.historyId;
                await saveHistoryIdInDb(newHistoryiD);
                return true;
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
 * Reliability:
 * Typically all notifications should be delivered reliably within a few seconds; however in some
 * extreme situations
 * notifications may be delayed or dropped. Make sure to handle this possibility gracefully, so
 * that the application still syncs even if no push messages are received. For example, fall back
 * to periodically calling <history.list> after a period with no notifications for a user.
 * 
 * You must re-call watch at least every 7 days or else you will stop receiving updates for the
 * user. We recommend calling watch once per day. The watch response also has an expiration field
 * with the timestamp for the watch expiration.
 * @param req 
 * @param res 
 */
const watchMails = async (req: Request, res: Response): Promise<void> => {
    try {

        const { token } = await oAuth2Client.getAccessToken();

        const url = `https://www.googleapis.com/gmail/v1/users/${cpnzEmail}/watch`;
        const topic = process.env.GOOGLE_CLOUD_TOPIC_ID ?? ''
        const data = {
            topicName: `projects/cpnztestproj-426002/topics/${topic}`,
            labelIds: ["UNREAD"],
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

const stopWatchMails = async (req: Request, res: Response): Promise<void> => {
    try {

        const { token } = await oAuth2Client.getAccessToken();

        const url = `https://www.googleapis.com/gmail/v1/users/${cpnzEmail}/stop`;
        const data = {
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


export { getMails, watchMails, getHistoryRecords, stopWatchMails, saveHistoryIdInDb };
