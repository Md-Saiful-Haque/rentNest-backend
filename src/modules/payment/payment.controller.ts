import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

// const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
//     const tenantId = req.user?.id;

//     const result = await paymentService.createPaymentIntent(tenantId as string, req.body);

//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.OK,
//         message: `Rental request successfully`,
//         data: result
//     })
// });

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
    const tenantId = req.user?.id;

    const result = await paymentService.createCheckoutSession(tenantId as string, req.body.rentalRequestId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: `Rental request successfully`,
        data: result
    })
});

const confirmPayment = catchAsync(async (req, res) => {

    const result = await paymentService.confirmPayment(
        req.body.sessionId
    );

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Payment confirmed successfully",
        data: result,
    });

});

const getMyPayments = catchAsync(async (req, res) => {
  const tenantId = req.user!.id;

  const result = await paymentService.getMyPayments(tenantId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Payment history retrieved successfully",
    data: result,
  });
});

export const paymentController = {
    createPaymentIntent,
    confirmPayment,
    getMyPayments
} 