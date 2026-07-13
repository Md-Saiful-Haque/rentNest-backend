import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { rentalController } from "./rental.controller";

const router = Router()

router.get('/', auth(Role.TENANT), rentalController.getRentalRequest)

// Get all rental requests for landlord's properties
router.get('/landlord-requests', auth(Role.LANDLORD), rentalController.getLandlordRequest)

router.get('/:id', rentalController.getRentalRequestById)

router.post('/', auth(Role.TENANT), rentalController.createRentalRequest)

export const rentalRoute = router;