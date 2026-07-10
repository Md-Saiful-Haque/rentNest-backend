import { Router } from "express";
import { categoryController } from "./category.controller";

const router = Router();

router.post('/', categoryController.createAllCategories);

export const categoryRoute = router;