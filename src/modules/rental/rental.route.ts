import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { rentalController } from "./rental.controller";

const router = Router()

router.get('/', auth(Role.TENANT), rentalController.getRentalRequest)

router.post('/', auth(Role.TENANT), rentalController.createRentalRequest)

export const rentalRoute = router;