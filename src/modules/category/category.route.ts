import { Router } from "express";
import { categoryController } from "./category.controller";

const router = Router();

router.post('/', categoryController.createAllCategories);

// Public
router.get('/', categoryController.getAllCategories);

export const categoryRoute = router;