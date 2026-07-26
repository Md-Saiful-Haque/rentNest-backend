import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllUsers();

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Users retrieved successfully",
        data: result,
    });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const result = await adminService.updateUserStatus(userId as string, req.body.status);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User status updated successfully",
        data: result,
    });
});

export const adminController = {
    getAllUsers,
    updateUserStatus
};