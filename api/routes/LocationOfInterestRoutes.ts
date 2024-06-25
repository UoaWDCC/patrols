import { Router } from 'express';
import { createLocationOfInterest, getLocationOfInterestByPatrolId } from '../controller/LocationOfInterestController';

const locationOfInterestRoute = Router();

locationOfInterestRoute.route('/')
    .post(createLocationOfInterest);

locationOfInterestRoute.route('/:id')
    .get(getLocationOfInterestByPatrolId);

export default locationOfInterestRoute;