import { Router } from 'express';
import { getUserDetailsByCPNZID } from '../controller/UserController';

const userRoutes = Router();

userRoutes.route('/getUserDetails').get(getUserDetailsByCPNZID);

export default userRoutes;
