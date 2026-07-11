import { prisma } from "../../lib/prisma";
import { FilterProperty, IUpdateProperty, PropertyInput } from "./properties.interface";

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

const getPropertyById = async (id: string) => {
    const property = await prisma.property.findUnique({
        where: { id },
        include: {
            category: true,
            landlord: { select: { id: true, name: true, phone: true, email: true } },
            reviews: {
                include: { tenant: { select: { id: true, name: true } } },
            },
        },
    });

    if (!property) {
        throw new Error('Property not found')
    }

    return property;
};

const updateProperty = async (propertyId: string, landlordId: string, data: IUpdateProperty) => {
    const property = await prisma.property.findUnique({ where: { id: propertyId } });

    if (!property) {
        throw new Error('Property not found');
    }

    if (property.landlordId !== landlordId) {
        throw new Error('You are not authorized to update this property');
    }

    return prisma.property.update({
        where: { id: propertyId },
        data,
    });
};

const deleteProperty = async (propertyId: string, landlordId: string) => {
    const property = await prisma.property.findUnique({ where: { id: propertyId } });

    if (!property) {
        throw new Error('Property not found');
    }

    if (property.landlordId !== landlordId) {
        throw new Error('You are not authorized to update this property');
    }

    return prisma.property.delete({ where: { id: propertyId } });
};

const getLandlordProperties = async (landlordId: string) => {
    return prisma.property.findMany({
        where: { landlordId },
        include: { category: true }
    });
};


export const propertyService = {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    getLandlordProperties
}