import { Router } from 'express';
import { propertyController } from './properties.controller';
import { auth } from '../../middlewares/auth';


const router = Router();

router.post('/', auth("LANDLORD"), propertyController.createProperty);


export const propertyRoute = router;