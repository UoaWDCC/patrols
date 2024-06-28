import { Router } from 'express';
import { logOffStatus } from '../controller/LogOffController';

const logOffRoutes = Router();

logOffRoutes.route('/:id')
    .patch(logOffStatus)

export default logOffRoutes;
