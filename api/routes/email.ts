import { Router } from 'express';
import { sendEmail } from '../controller/emailController';
import { getMails, watchMails } from '../controller/gmailController';

const emailRoute = Router();

emailRoute.route('/sendEmail').post(sendEmail);
emailRoute.route('/fetchMessages').get(getMails)
emailRoute.route('/monitorEmails').post(watchMails) // not working yet

export default emailRoute;