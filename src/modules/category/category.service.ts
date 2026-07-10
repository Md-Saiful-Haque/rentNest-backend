import { prisma } from "../../lib/prisma";
import { ICreateCategory } from "./category.interface";

const createCategory = async (data: ICreateCategory) => {
    const existing = await prisma.category.findUnique({
        where: { name: data.name },
    });

    if (existing) {
        const error: any = new Error('Category already exists');
        error.statusCode = 409;
        throw error;
    }

    return prisma.category.create({ data });
};

const getAllCategories = async () => {
    return prisma.category.findMany({
        orderBy: { createdAt: 'asc' },
    });
};


export const categoryService = {
    createCategory,
    getAllCategories
}