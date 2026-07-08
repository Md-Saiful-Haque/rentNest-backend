import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import HttpStatus from 'http-status';
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service";

const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await authService.createUserIntoDB(payload);
    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: `${result?.role === 'TENANT' ? 'Tenant' : 'Landlord'} registerd successfully`,
        data: result
    });
})


export const authController = {
    registerUser
} 