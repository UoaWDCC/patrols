import { Router } from 'express';
import { addVehicle, getSingleVehicle } from '../controller/vehicleController';

const vehicleRoutes = Router();

vehicleRoutes.route('/:id')
    .get(getSingleVehicle)
    .post(addVehicle);

export default vehicleRoutes;