import axios from 'axios';
import { google } from 'googleapis';
import { Request, Response } from 'express';
import { createGetConfig, createPostConfig } from '../auth_util/gmailAuth';

/**
 * After create a oAuth credential in google cloud project using our cpnz email,
 * it will generate three property as shown in 'oAuth2Client' below
 */
const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI, // I am really sure whether this redirect url applicable in our case, but seems to be required using oAuth, currently set to https://developers.google.com/oauthplayground
);

const cpnzEmail = process.env.CPNZ_EMAIL_TEST; //this is our cpnz email used for sending to ECC

/**
 * https://developers.google.com/oauthplayground
 * Go to above website, click on the gear icon on the top right corner
 * copy client ID and client secret from the above and save
 * Go to the panel at LHS
 * select the api access we want to grant our project to and authorize
 * and exchange authorization code for tokens
 * and copy the refresh token to .env and will be used here.
 */
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

/**
 * Fetch email owner's profile info.
 * @param req 
 * @param res 
 */
const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const url = `https://gmail.googleapis.com/gmail/v1/users/${cpnzEmail}/profile`;
        const { token } = await oAuth2Client.getAccessToken();
        if (token) {
            const config = createGetConfig(url, token);
            const response = await axios(config);
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
 * Currently set to fetch list of threads
 * 
 * To fetch a subject and body of a email the url would be:
 * https://gmail.googleapis.com/gmail/v1/users/${cpnzEmail}/messages/<messages ID>
 * 
 * The messages ID will need to fetch a list of messages first:
 * ttps://gmail.googleapis.com/gmail/v1/users/${cpnzEmail}/messages?maxresult=10
 * 
 * @param req 
 * @param res 
 */
const getMails = async (req: Request, res: Response): Promise<void> => {

    try {
        const url = `https://gmail.googleapis.com/gmail/v1/users/${cpnzEmail}/messages?maxresult=10`;
        const { token } = await oAuth2Client.getAccessToken();
        if (token) {
            const config = createGetConfig(url, token);
            const response = await axios(config);
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
 * This is not working yet, insufficient scope return by the api call, finding a way to work this around now
 * @param req 
 * @param res 
 */
const watchMails = async (req: Request, res: Response): Promise<void> => {
    try {

        const {token} = await oAuth2Client.getAccessToken();

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

export { getUser, getMails, watchMails };
