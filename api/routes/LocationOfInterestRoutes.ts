import { Router } from 'express';
import { createLocationOfInterest } from '../controller/LocationOfInterestController';

const locationOfInterestRoute = Router();

locationOfInterestRoute.route('/')
    .post(createLocationOfInterest);

export default locationOfInterestRoute;