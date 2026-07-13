import { prisma } from "../../lib/prisma";
import { IRentalRequest } from "./rental.interface";

const createRentalRequest = async (tenantId: string, data: IRentalRequest) => {
    const property = await prisma.property.findUnique({
        where: { id: data.propertyId },
    });

    if (!property) {
        throw new Error('Property not found');
    }

    if (property.landlordId === tenantId) {
        throw new Error('You cannot request your own property');
    }

    const existRequest = await prisma.rentalRequest.findFirst({
        where: {
            tenantId,
            propertyId: data.propertyId,
            status: 'PENDING',
        },
    });

    if (existRequest) {
        throw new Error('You already have a pending request for this property');
    }

    // Calculate total price
    const days = Math.ceil(
        (new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const totalPrice = days * property.price;

    return prisma.rentalRequest.create({
        data: {
            tenantId,
            propertyId: data.propertyId,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            totalPrice,
            message: data.message
        },
        include: { property: true },
    });
};

const getRentalRequest = async (tenantId: string) => {
    return prisma.rentalRequest.findMany({
        where: { tenantId },
        include: {
            property: { include: { category: true } },
            payment: true,
        },
        orderBy: { createdAt: 'desc' },
    });
};

const getLandlordRentalRequest = async (landlordId: string) => {
    return prisma.rentalRequest.findMany({
        where: {
            property: { landlordId },
        },
        include: {
            property: true,
            tenant: { select: { id: true, name: true, email: true, phone: true } },
        },
        orderBy: { createdAt: 'desc' },
    });
};


export const rentalService = {
    createRentalRequest,
    getRentalRequest,
    getLandlordRentalRequest
}