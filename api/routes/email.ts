import { Router } from 'express';
import { sendEmail } from '../controller/emailController';
import { getMails, getUser, watchMails, getHistoryRecords } from '../controller/gmailController';

const emailRoute = Router();

emailRoute.route('/sendEmail').post(sendEmail);
emailRoute.route('/fetchMessage').get(getMails)
emailRoute.route('/fetchGmailUser').get(getUser)
emailRoute.route('/monitorEmails').post(watchMails) // not working yet
emailRoute.route('/checkNewEmails').get(getHistoryRecords)

export default emailRoute;