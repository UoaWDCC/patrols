import { Router } from 'express';
import { sendEmail } from '../controller/emailController';

const emailRoute = Router();

emailRoute.route('/')
    .post(sendEmail);

export default emailRoute;