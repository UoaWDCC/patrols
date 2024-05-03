import { Router } from 'express';
import { getUserDetailsByEmail } from '../controller/UserController';

const userRoutes = Router();

userRoutes.route('/getUserDetails').get(getUserDetailsByEmail);

export default userRoutes;
