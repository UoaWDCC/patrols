import { Router } from 'express';
import { createVehicle } from '../controller/VehicleController';

const vehicleRoute = Router();

vehicleRoute.route('/')
    .post(createVehicle);

export default vehicleRoute;