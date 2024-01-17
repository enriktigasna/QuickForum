import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();

const getUser = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    prisma.user.findUnique({
        where: {
            userId: id
        },
        select: {
            email: true,
            username: true,
            registrationDate: true,
            lastLoginDate: true,
            isAdmin: true,
            bio: true,
        },
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
        select: {
            email: true,
            username: true,
            registrationDate: true,
            lastLoginDate: true,
            isAdmin: true,
            bio: true,
        }, orderBy: {
            lastLoginDate: 'desc'
        }
    }
    ).then((users) => {
        res.json(users);
    }).catch((error) => {
        res.json(error);
    });
}

const getMe = async (req: Request, res: Response) => {
    const userId = req.user as number;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
        where: { userId },
            select: {
            email: true,
            username: true,
            registrationDate: true,
            lastLoginDate: true,
            isAdmin: true,
            bio: true,
        },
    });

    if (!user) return(res.status(404).json({ error: 'User not found' }));

    res.json(user);
};

// User resources

const getUserThreads = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    prisma.thread.findMany({
        where: {
            userId: id
        }
    }).then((threads) => {
        res.json(threads);
    }).catch((error) => {
        res.json(error);
    });
}

const getUserPosts = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    prisma.post.findMany({
        where: {
            userId: id
        }
    }).then((posts) => {
        res.json(posts);
    }).catch((error) => {
        res.json(error);
    });
}

const getUserReplies = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    prisma.reply.findMany({
        where: {
            userId: id
        }
    }).then((replies) => {
        res.json(replies);
    }).catch((error) => {
        res.json(error);
    });
}

export {
    getUser,
    getUsers,
    getMe,
    getUserThreads,
    getUserPosts,
    getUserReplies,
}