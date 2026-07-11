import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rentalService } from "./rental.service";
import httpStatus from 'http-status';
import { sendResponse } from "../../utils/sendResponse";

const createRentalRequest = catchAsync(async (req: Request, res: Response) => {
    const tenantId = req.user?.id;

    const request = await rentalService.createRentalRequest(tenantId as string, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental request submitted successfully",
        data: request
    })
});

export const rentalController = {
    createRentalRequest
}