import { Router } from 'express';
import {
    getUserDetailsByEmail,
    updateUserDetails,
} from '../controller/UserController';

const userRoutes = Router();

userRoutes.route('/getUserDetails').get(getUserDetailsByEmail);
userRoutes.route('/updateUserDetails').patch(updateUserDetails);

export default userRoutes;
