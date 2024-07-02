import { Router } from 'express';
import { createLocationOfInterest, deleteLocationOfInterest, getLocationOfInterestByPatrolId } from '../controller/LocationOfInterestController';

const locationOfInterestRoute = Router();

locationOfInterestRoute.route('/')
    .post(createLocationOfInterest);

locationOfInterestRoute.route('/:id')
    .get(getLocationOfInterestByPatrolId)
    .delete(deleteLocationOfInterest);

export default locationOfInterestRoute;