import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewService } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";

const createReview = catchAsync(async (req: Request, res: Response) => {

    const tenantId = req.user?.id;

    const result = await reviewService.createReview(tenantId as string, req.body);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Review submitted successfully",
        data: result,
    });

});

export const reviewController = {
    createReview
};