import { Router } from 'express';
import { createVehicle, deleteVehicle, getVehicleByPatrolId } from '../controller/VehicleController';

const vehicleRoute = Router();

vehicleRoute.route('/')
    .post(createVehicle);

vehicleRoute.route('/:id')
    .get(getVehicleByPatrolId)
    .delete(deleteVehicle);

export default vehicleRoute;