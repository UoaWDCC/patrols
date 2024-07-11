import { Router } from 'express';
import { logOffStatus, logOffEmail } from '../controller/LogOffController';

const logOffRoutes = Router();

logOffRoutes.route('/:id').patch(logOffStatus)
logOffRoutes.route('/').post(logOffEmail)

export default logOffRoutes;
