import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'
import { authenticateUser } from '../auth/authenticate';
import { validateToken } from '../auth/validate';

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
        },
    }
    ).then((users) => {
        res.json(users);
    }).catch((error) => {
        res.json(error);
    });
}

const getMe = async (req: Request, res: Response) => {
    
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'No authorization header provided' });
    }

    const token = authHeader.split(' ')[1]; // Assumes a "Bearer [token]" format
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const userId = await validateToken(token);
        if (!userId) {
            return res.status(401).json({ error: 'Invalid token' });
        }

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

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Authentication portion

const registerUser = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);

    prisma.user.create({
        data: {
            email,
            username,
            passwordHash,
            registrationDate: new Date(),
            lastLoginDate: new Date(),
            isAdmin: false,
        },
    }).then((user) => {
        res.json(user);
    }).catch((error) => {
        res.json(error);
    });
};

const loginUser = async (req: Request, res: Response) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const token = await authenticateUser(login, password);
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const validateUser = async (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const userId = await validateToken(token);
        res.json({ userId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

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
    registerUser,
    loginUser,
    validateUser,
    getUser,
    getUsers,
    getMe,
    getUserThreads,
    getUserPosts,
    getUserReplies,
}