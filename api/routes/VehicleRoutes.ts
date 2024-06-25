import { Router } from 'express';
import { createVehicle, deleteVehicle } from '../controller/VehicleController';

const vehicleRoute = Router();

vehicleRoute.route('/')
    .post(createVehicle);

vehicleRoute.route('/:id')
    .delete(deleteVehicle);

export default vehicleRoute;