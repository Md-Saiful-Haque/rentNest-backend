import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { propertyService } from "./properties.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';

const createProperty = catchAsync(async (req: Request, res: Response) => {
    const landlordId = req.user?.id;

    const property = await propertyService.createProperty(landlordId as string, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property created successfully",
        data: property
    })
});

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const properties = await propertyService.getAllProperties(query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Properties Retrieved Successfully",
        data: properties
    })
});

const getPropertyById = catchAsync(async (req: Request, res: Response) => {
    const propertyId = req.params.id;
    const property = await propertyService.getPropertyById(propertyId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Properties Retrieved Successfully",
        data: property
    });
});

const updateProperty = catchAsync(async (req: Request, res: Response) => {
    const landlordId = req.user?.id;
    const propertyId = req.params.id;
    const payload = req.body;

    const result = await propertyService.updateProperty(propertyId as string, landlordId as string, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post updated successfully",
        data: result
    })
});

const deleteProperty = catchAsync(async (req: Request, res: Response) => {
    const landlordId = req.user?.id;
    const propertyId = req.params.id;

    const result = await propertyService.deleteProperty(propertyId as string, landlordId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property deleted successfully",
        data: result
    })
});

const getMyProperties = catchAsync(async (req: Request, res: Response) => {
    const landlordId = req.user?.id;

    const result = await propertyService.getLandlordProperties(landlordId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My properties retrieved successfuly",
        data: result
    })
});



export const propertyController = {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    getMyProperties
}