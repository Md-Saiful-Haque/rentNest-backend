import { Router } from 'express';
import { propertyController } from './properties.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '../../../generated/prisma/enums';


const router = Router();

// Public routes
router.get('/', propertyController.getAllProperties);

// get my properties (Only Landlord)
router.get('/my-properties', auth(Role.LANDLORD), propertyController.getAllProperties)

// byId
router.get('/:id', propertyController.getPropertyById);


router.post('/', auth(Role.LANDLORD), propertyController.createProperty);

router.put('/:id', auth(Role.LANDLORD), propertyController.updateProperty)

router.delete('/:id', auth(Role.LANDLORD), propertyController.deleteProperty)

export const propertyRoute = router;