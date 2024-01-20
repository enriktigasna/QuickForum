import { Request, Response } from "express";
import prisma from "../../server";

const getUsers = async (req: Request, res: Response) => {
    const { page, limit } = req.query;

    if (Number(limit) > 50) {
        res.json({ error: "Limit cannot be greater than 50" });
    }

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    prisma.user
        .findMany({
            skip: offset,
            take: limitNumber,
            select: {
                userId: true,
                username: true,
                registrationDate: true,
                lastLoginDate: true,
                isAdmin: true,
                bio: true,
            },
            orderBy: {
                lastLoginDate: "desc",
            },
        })
        .then((users) => {
            res.json(users);
        })
        .catch((error) => {
            res.json(error);
        });
};

export default getUsers;