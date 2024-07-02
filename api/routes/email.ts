import { Router } from 'express';
import { sendEmail, handleAmendment } from '../controller/emailController';

const emailRoute = Router();

emailRoute.route('/')
    .post(sendEmail);

emailRoute.route('/amendment')
    .post(handleAmendment);

export default emailRoute;
