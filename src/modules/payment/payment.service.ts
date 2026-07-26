import { PaymentProvider, PaymentStatus, RentalRequestStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
// import { CreatePaymentInput } from "./payment.interface";


// const createPaymentIntent = async (tenantId: string, payload: CreatePaymentInput) => {
//   const { rentalRequestId } = payload

//   const rentalRequest = await prisma.rentalRequest.findUnique({
//     where: { id: rentalRequestId },
//     include: { property: true, payment: true },
//   });

//   if (!rentalRequest) {
//     throw new Error('Rental request not found');
//   }

//   if (rentalRequest.tenantId !== tenantId) {
//     throw new Error('You are not authorized to pay for this request');
//   }

//   if (rentalRequest.status !== 'APPROVED') {
//     throw new Error('This rental request is not approved yet');
//   }

//   if (rentalRequest.payment) {
//     throw new Error('Payment already exists for this rental request');
//   }


//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: rentalRequest.totalPrice,
//     currency: 'usd',
//     automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
//     metadata: {
//       rentalRequestId: rentalRequest.id,
//       tenantId,
//       propertyId: rentalRequest.propertyId,
//     },
//   });


//   const payment = await prisma.payment.create({
//     data: {
//       transactionId: paymentIntent.id,
//       amount: rentalRequest.property.price,
//       method: 'card',
//       provider: 'STRIPE',
//       status: 'PENDING',
//       rentalRequestId: rentalRequest.id,
//     },
//   });

//   return {
//     paymentId: payment.id,
//     clientSecret: paymentIntent.client_secret,
//     transactionId: paymentIntent.id,
//     amount: rentalRequest.property.price,
//   };
// };

const createCheckoutSession = async (
  tenantId: string,
  rentalRequestId: string
) => {

  const rental = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalRequestId,
    },
    include: {
      payment: true,
      property: true,
    },
  });

  if (!rental) {
    throw new Error("Rental request not found");
  }

  if (rental.tenantId !== tenantId) {
    throw new Error("You are not authorized to pay for this rental");
  }

  if (rental.status !== RentalRequestStatus.APPROVED) {
    throw new Error(
      `Rental is not payable. Current status: ${rental.status}`
    );
  }

  if (rental.payment) {
    if (rental.payment.status === PaymentStatus.COMPLETED) {
      throw new Error("This rental has already been paid");
    }
  }

  // Stripe amount (cents)
  const amount = Math.round(rental.totalPrice * 100);

  // Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    payment_method_types: ["card"],

    line_items: [
      {
        price_data: {
          currency: "usd",

          unit_amount: amount,

          product_data: {
            name: rental.property.title,
            description: rental.property.address,
          },
        },

        quantity: 1,
      },
    ],

    success_url: `${process.env.APP_URL}/payment/success`,

    cancel_url: `${process.env.APP_URL}/payment/cancel`,

    metadata: {
      rentalRequestId: rental.id,
      tenantId,
    },
  });

  const paymentIntentPlaceholder = `pending_${session.id}`;

  await prisma.payment.upsert({
    where: {
      rentalRequestId,
    },

    update: {
      status: PaymentStatus.PENDING,
      transactionId: paymentIntentPlaceholder,
      amount: rental.totalPrice,
      provider: PaymentProvider.STRIPE,
    },

    create: {
      rentalRequest: {
        connect: {
          id: rentalRequestId,
        },
      },

      transactionId: paymentIntentPlaceholder,

      amount: rental.totalPrice,

      method: "CARD",

      provider: PaymentProvider.STRIPE,

      status: PaymentStatus.PENDING,
    },
  });

  return {
    sessionId: session.id,
    url: session.url,
  };
};

const confirmPayment = async (sessionId: string) => {

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    throw new Error("Checkout session not found");
  }

  if (session.payment_status !== "paid") {
    throw new Error("Payment has not been completed");
  }

  const rentalRequestId = session.metadata?.rentalRequestId;

  if (!rentalRequestId) {
    throw new Error("Rental request id not found");
  }

  await prisma.payment.update({
    where: {
      rentalRequestId,
    },
    data: {
      status: PaymentStatus.COMPLETED,
      transactionId: session.payment_intent as string,
      paidAt: new Date(),
    },
  });

  await prisma.rentalRequest.update({
    where: {
      id: rentalRequestId,
    },
    data: {
      status: RentalRequestStatus.ACTIVE,
    },
  });

  return {
    paymentStatus: "COMPLETED",
    rentalStatus: "ACTIVE",
  };
};

export const paymentService = {
  // createPaymentIntent
  createCheckoutSession,
  confirmPayment
}