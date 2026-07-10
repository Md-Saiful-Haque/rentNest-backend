import { PropertyWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IPropertyQuery } from "./properties.interface"


const getAllProperties = async (query: IPropertyQuery) => {
    const sortby = query.sortby ? query.sortby : 'createdAt';
    const sortOrder = query.sortOrder ? query.sortOrder : 'desc';
    const andConditions: PropertyWhereInput[] = [];
    if (query.searchTerm) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: query.searchTerm,
                        mode: 'insensitive'
                    }
                },
                {
                    description: {
                        contains: query.searchTerm,
                        mode: 'insensitive'
                    }
                }
            ]
        });
    }
    if (query.title) {
        andConditions.push({
            title: query.title
        });
    }
    if (query.description) {
        andConditions.push({
            description: query.description
        });
    }
    if (query.price) {
        andConditions.push({
            price: Number(query.price)
        });
    }
    if (query.landlordId) {
        andConditions.push({
            landlordId: query.landlordId
        });
    }
    if (query.availability) {
        andConditions.push({
            availability: query.availability
        });
    }
    const property = await prisma.property.findMany({
        where: {
            AND: andConditions
        },
        orderBy: {
            [sortby]: sortOrder
        },
        include: {
            category: true,
            technician: true
        }
    });
    return property;
}

export const propertyService = {
    getAllProperties
}