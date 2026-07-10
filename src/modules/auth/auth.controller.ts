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

const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const { accessToken, refreshToken } = await authService.loginUser(payload);
  // ? accessToken and refreshToken setup

  // accessToken
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 // 1D
  });
  // refreshToken
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7D
  });

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Login successfully',
    data: { accessToken, refreshToken }
  });
});


export const authController = {
  registerUser,
  loginUser
} 