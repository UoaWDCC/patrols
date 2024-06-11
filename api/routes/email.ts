import { Router } from 'express';
import { sendEmail } from '../controller/emailController';
import { getMails, watchMails, stopWatchMails } from '../controller/gmailController';

const emailRoute = Router();

emailRoute.route('/sendEmail').post(sendEmail);
emailRoute.route('/fetchMessages').get(getMails)
emailRoute.route('/monitorEmails').post(watchMails)
emailRoute.route('/stopMonitor').post(stopWatchMails)

export default emailRoute;