import { Router } from 'express';
import { sendEmail } from '../controller/emailController';
import { watchMails, stopWatchMails } from '../controller/gmailController';

const emailRoute = Router();

emailRoute.route('/sendEmail').post(sendEmail);
emailRoute.route('/monitorEmails').post(watchMails)
emailRoute.route('/stopMonitor').post(stopWatchMails)

export default emailRoute;