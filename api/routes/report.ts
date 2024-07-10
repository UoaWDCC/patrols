import { Router } from "express";
import {
  getSingleReport,
  getAllReport,
  createReport,
  updateReport,
  deleteReport,
  getAllReportForLead,
} from "../controller/reportController";

const reportRoutes = Router();

reportRoutes.route("/").get(getAllReport).post(createReport);

reportRoutes.route("/lead/:id").get(getAllReportForLead);

reportRoutes
  .route("/:id")
  .get(getSingleReport)
  .patch(updateReport)
  .delete(deleteReport);

// reportRoutes.route('/lead/:id')
//     .get(getAllReportForLead)

export default reportRoutes;
