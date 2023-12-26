import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getThreads = async (req: Request, res: Response) => {
    const { page, limit } = req.query;

    if (Number(limit) > 50) {
        res.json({ error: 'Limit cannot be greater than 50' });
    }

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    prisma.thread.findMany({
        skip: offset,
        take: limitNumber,
    }).then((threads) => {
        res.json(threads);
    }).catch((error) => {
        res.json(error);
    });
}

const getThread = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    prisma.thread.findUnique({
        where: {
            threadId: id
        }
    }).then((thread) => {
        res.json(thread);
    }).catch((error) => {
        res.json(error);
    });
}

export {
    getThreads,
    getThread
}