import { Router } from 'express';
import { sendEmail } from '../controller/emailController';
import { getMails, getUser, watchMails } from '../controller/gmailController';

const emailRoute = Router();

emailRoute.route('/sendEmail').post(sendEmail);
emailRoute.route('/fetchGmailThread').get(getMails)
emailRoute.route('/fetchGmailUser').get(getUser)
emailRoute.route('/monitorEmails').post(watchMails) // not working yet

export default emailRoute;