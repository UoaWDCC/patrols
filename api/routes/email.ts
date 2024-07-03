import { Router } from 'express';
import { sendShiftRequest } from '../controller/emailController';
import { watchMails, stopWatchMails } from '../controller/gmailController';

const emailRoute = Router();
emailRoute.route('/').post(sendShiftRequest);
emailRoute.route('/monitorEmails').post(watchMails)
emailRoute.route('/stopMonitor').post(stopWatchMails)


export default emailRoute;