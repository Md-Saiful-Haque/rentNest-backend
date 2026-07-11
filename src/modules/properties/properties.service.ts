import { prisma } from "../../lib/prisma";
import { PropertyInput } from "./properties.interface";

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


export const propertyService = {
    createProperty
}