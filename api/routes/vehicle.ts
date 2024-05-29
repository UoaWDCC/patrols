import { Router } from 'express';
import { addVehicle, deleteVehicle, getSingleVehicle, getVehicleByPatrolId, updateVehicle } from '../controller/vehicleController';

const vehicleRoutes = Router();

vehicleRoutes.route('/:id')
    .get(getSingleVehicle)
    .post(addVehicle)
    .delete(deleteVehicle)
    .patch(updateVehicle);

vehicleRoutes.route('/patrol/:id')
    .get(getVehicleByPatrolId);


export default vehicleRoutes;