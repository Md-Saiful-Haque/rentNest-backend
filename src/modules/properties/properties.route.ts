import { Router } from 'express';
import { propertyController } from './properties.controller';
import { auth } from '../../middlewares/auth';


const router = Router();

// Public routes
router.get('/', propertyController.getAllProperties);

// byId
router.get('/:id', propertyController.getPropertyById);

router.post('/', auth("LANDLORD"), propertyController.createProperty);

router.put('/:id', auth("LANDLORD"), propertyController.updateProperty)

export const propertyRoute = router;