import { Router } from 'express';
import { propertyController } from './properties.controller';


const router = Router();

router.get('/properties', propertyController.getAllProperties);
// router.get('/technicians', serviceController.getAllTechnicians);
// router.get('/technicians/:id', serviceController.getSingleTechnician);
// router.get('/categories', serviceController.getAllCategories);

export const propertyRoute = router;