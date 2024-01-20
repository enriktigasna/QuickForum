import e, { Request, Response } from 'express';
import prisma from '../../server';

const getThreads = async (req: Request, res: Response) => {
    const { page, limit } = req.query;

    if (Number(limit) > 50) {
        res.json({ error: 'Limit cannot be greater than 50' });
    }

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    const threads = await prisma.thread.findMany({
        skip: offset,
        take: limitNumber,
    })

    res.json(threads);
}

export default getThreads;