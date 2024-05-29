import { Router } from 'express';
import { addVehicle, getSingleVehicle, getVehicleByPatrolId } from '../controller/vehicleController';

const vehicleRoutes = Router();

vehicleRoutes.route('/:id')
    .get(getSingleVehicle)
    .post(addVehicle);

vehicleRoutes.route('/patrol/:id')
    .get(getVehicleByPatrolId);


export default vehicleRoutes;