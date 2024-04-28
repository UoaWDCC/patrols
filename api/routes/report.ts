import { Router } from 'express';
import { getSingleReport, getAllReport, createReport, updateReport, deleteReport} from '../controller/reportController';

const reportRoutes = Router();

reportRoutes.route('/')
    .get(getAllReport)
    .post(createReport);

reportRoutes.route('/:id')
    .get(getSingleReport)
    .patch(updateReport)
    .delete(deleteReport);


export default reportRoutes;