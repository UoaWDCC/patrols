import { Router } from 'express';
import { addVehicle, deleteVehicle, getSingleVehicle, getVehicleByPatrolId } from '../controller/vehicleController';

const vehicleRoutes = Router();

vehicleRoutes.route('/:id')
    .get(getSingleVehicle)
    .post(addVehicle)
    .delete(deleteVehicle);

vehicleRoutes.route('/patrol/:id')
    .get(getVehicleByPatrolId);


export default vehicleRoutes;