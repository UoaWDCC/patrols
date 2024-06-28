import { Router } from 'express';
import { getUserDetailsByCPNZID, handleAmendment } from '../controller/UserController';

const userRoutes = Router();

userRoutes.route('/getUserDetails').get(getUserDetailsByCPNZID);
userRoutes.route('/amendment').post(handleAmendment);

export default userRoutes;
