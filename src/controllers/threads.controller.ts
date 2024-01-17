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

    const threads = await prisma.thread.findMany({
        skip: offset,
        take: limitNumber,
    })

    res.json(threads);
}

const getThread = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if(!id) return res.status(400).json({ error: 'No thread ID provided' });

    const thread = await prisma.thread.findUnique({
        where: {
            threadId: id
        }
    })
    if(!thread) return res.status(404).json({ error: 'Thread not found' });

    res.json(thread);
}

const getThreadPosts = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if(!id) return res.status(400).json({ error: 'No thread ID provided' });

    const thread = await prisma.thread.findUnique({
        where: {
            threadId: id
        }
    })
    if(!thread) return res.status(404).json({ error: 'Thread not found' });

    const posts = await prisma.post.findMany({
        where: {
            threadId: id
        }
    })
    res.json(posts);
}

export {
    getThreads,
    getThread,
    getThreadPosts
}