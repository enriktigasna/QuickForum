import { Request, Response } from "express";
import prisma from "../../server";

const getCategories = async (req: Request, res: Response) => {
    const categories = await prisma.category.findMany({
        select: {
            categoryId: true,
            categoryName: true,
            description: true,
            _count: {
                select: { threads: true }
            },
            threads: {
                orderBy: { creationDate: "desc" },
                take: 1,
                include: {user: {select: {username: true}}}
            }
        }
    });

    res.json(categories);
};

export default getCategories;