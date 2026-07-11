import { prisma } from "../../lib/prisma";
import { FilterProperty, PropertyInput } from "./properties.interface";

export const createProperty = async (landlordId: string, data: PropertyInput) => {

    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) {
        const error: any = new Error('Category not found');
        error.statusCode = 404;
        throw error;
    }

    return prisma.property.create({
        data: {
            ...data,
            landlordId,
        },
    });
};

const getAllProperties = async (filters: FilterProperty) => {
    const where: any = { availability: true };

    if (filters.location) {
        where.OR = [
            {
                city: {
                    contains: filters.location,
                    mode: "insensitive",
                },
            },
            {
                address: {
                    contains: filters.location,
                    mode: "insensitive",
                },
            },
        ];
    }

    if (filters.categoryId) {
        where.categoryId = filters.categoryId;
    }

    if (filters.bedrooms) {
        where.bedrooms = Number(filters.bedrooms);
    }

    if (filters.minPrice || filters.maxPrice) {
        where.price = {};

        if (filters.minPrice) {
            where.price.gte = Number(filters.minPrice);
        }

        if (filters.maxPrice) {
            where.price.lte = Number(filters.maxPrice);
        }
    }

    return prisma.property.findMany({
        where,
        include: {
            category: true,
            landlord: { select: { id: true, name: true, phone: true } },
        },
        orderBy: { createdAt: 'desc' },
    });
};


export const propertyService = {
    createProperty,
    getAllProperties
}