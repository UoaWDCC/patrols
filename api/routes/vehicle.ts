import { Router } from 'express';
import { getSingleVehicle } from '../controller/vehicleController';

const vehicleRoutes = Router();

vehicleRoutes.route('/:id')
    .get(getSingleVehicle);