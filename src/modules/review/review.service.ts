import { prisma } from "../../lib/prisma";
import { ICreateReview } from "./review.interface";

const createReview = async (tenantId: string, payload: ICreateReview) => {

    const property = await prisma.property.findUnique({
        where: {
            id: payload.propertyId,
        },
    });

    if (!property) {
        throw new Error("Property not found");
    }

    // Tenant completed this rental
    const rental = await prisma.rentalRequest.findFirst({
        where: {
            tenantId,
            propertyId: payload.propertyId,
            status: {
                in: ["ACTIVE", "COMPLETED"],
            },
        },
    });

    if (!rental) {
        throw new Error(
            "You can review only after completing the rental."
        );
    }

    // Already reviewed
    const existingReview = await prisma.review.findFirst({
        where: {
            tenantId,
            propertyId: payload.propertyId,
        },
    });

    if (existingReview) {
        throw new Error("You already reviewed this property.");
    }

    return prisma.review.create({
        data: {
            tenantId,
            propertyId: payload.propertyId,
            rating: payload.rating,
            comment: payload.comment,
        },
        include: {
            tenant: {
                select: {
                    id: true,
                    name: true,
                },
            },
            property: true,
        },
    });
};

export const reviewService = {
    createReview,
};