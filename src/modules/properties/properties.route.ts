import { Router } from 'express';
import { propertyController } from './properties.controller';
import { auth } from '../../middlewares/auth';


const router = Router();

// Public routes
router.get('/', propertyController.getAllProperties);

router.post('/', auth("LANDLORD"), propertyController.createProperty);


export const propertyRoute = router;