import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getUser = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    prisma.user.findUnique({
        where: {
            userId: id
        }
    }).then((user) => {
        res.json(user);
    }).catch((error) => {
        res.json(error);
    });
}

const getUsers = async (req: Request, res: Response) => {
    const { page, limit } = req.query;

    if (Number(limit) > 50) {
        res.json({ error: 'Limit cannot be greater than 50' });
    }

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    prisma.user.findMany({
        skip: offset,
        take: limitNumber,
    }).then((users) => {
        res.json(users);
    }).catch((error) => {
        res.json(error);
    });
}

export {
    getUser,
    getUsers
}