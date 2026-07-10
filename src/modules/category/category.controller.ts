import { catchAsync } from "../../utils/catchAsync"
import { Request, Response } from 'express';
import { sendResponse } from "../../utils/sendResponse";
import  httpStatus  from 'http-status';
import { categoryService } from "./category.service";

const createAllCategories = catchAsync(async (req: Request, res: Response) => {
    const category = await categoryService.createCategory(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All services retrieved successfully",
        data: category
    })
})

export const categoryController = {
    createAllCategories
}