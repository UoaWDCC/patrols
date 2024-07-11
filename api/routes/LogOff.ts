import { Router } from "express";
import { logOffEmail } from "../controller/LogOffController";

const logOffRoutes = Router();

logOffRoutes.route("/").post(logOffEmail);

export default logOffRoutes;
