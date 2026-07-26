import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post('/create', auth(Role.TENANT), paymentController.createPaymentIntent)

router.post('/confirm', auth(Role.TENANT), paymentController.confirmPayment)

router.get('/', auth(Role.TENANT), paymentController.getMyPayments)

export const paymentRoute = router;