import express from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { reviewController } from "./review.controller";

const router = express.Router();

router.post("/", auth(Role.TENANT), reviewController.createReview);

export const reviewRoutes = router;