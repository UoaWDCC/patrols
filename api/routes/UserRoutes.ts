import { Router } from 'express';
import {
    getUserDetailsByCPNZID,
    // updateUserDetails,
} from '../controller/UserController';

const userRoutes = Router();

userRoutes.route('/getUserDetails').get(getUserDetailsByCPNZID);
// userRoutes.route('/updateUserDetails').patch(updateUserDetails);

export default userRoutes;
