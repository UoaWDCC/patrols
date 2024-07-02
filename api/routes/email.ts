import { Router } from 'express';
import { sendShiftRequest } from '../controller/emailController';

const emailRoute = Router();

emailRoute.route('/')
    .post(sendShiftRequest);

export default emailRoute;