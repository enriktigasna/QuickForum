import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import { getUser, getUsers } from './controllers/users.controller';

const app = express();
const port = 3000;

const prisma = new PrismaClient();

declare global {
    interface BigInt {
        toJSON(): string;
    }
}

BigInt.prototype.toJSON = function() {
    return this.toString();
};


// Gets all users
app.get('/users', getUsers);

// Gets user by ID
app.get('/users/:id', getUser);

app.get('/threads', (req: Request, res: Response) => {
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
});

app.get('/threads/:id', (req: Request, res: Response) => {
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
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
