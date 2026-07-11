import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { propertyService } from "./properties.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';

export const createProperty = catchAsync(async (req: Request, res: Response) => {
  const landlordId = req.user?.id;

  const property = await propertyService.createProperty(landlordId as string, req.body);
  
  sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property created successfully",
        data: property
    })
});

export const propertyController = {
    createProperty
}