import { Router } from "express";
import { getAllStolenVehicle, getSingleStolenVehicle } from "../controller/stolenVehicleController";

const stolenVehicleRoutes = Router();
stolenVehicleRoutes.get("/", getAllStolenVehicle); 
stolenVehicleRoutes.get("/:registration_no", getSingleStolenVehicle);

export default stolenVehicleRoutes;