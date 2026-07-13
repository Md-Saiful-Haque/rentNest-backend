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

const getRentalRequest = catchAsync(async (req: Request, res: Response) => {
    const tenantId = req.user?.id;

    const result = await rentalService.getRentalRequest(tenantId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental requests retrieved successfully",
        data: result
    })
});

const getLandlordRequest = catchAsync(async (req: Request, res: Response) => {
    const landlordId = req.user?.id;

    const result = await rentalService.getLandlordRentalRequest(landlordId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental requests retrieved successfully",
        data: result
    })
});

export const rentalController = {
    createRentalRequest,
    getRentalRequest,
    getLandlordRequest
}