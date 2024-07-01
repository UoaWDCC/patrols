import { Router } from 'express';
import { sendLogOnEmail, handleAmendment } from '../controller/emailController';

const emailRoute = Router();

emailRoute.route('/')
    .post(sendLogOnEmail);

emailRoute.route('/amendment')
    .post(handleAmendment);

export default emailRoute;
