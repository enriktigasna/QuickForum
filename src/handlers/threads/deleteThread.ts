import { Request, Response } from 'express';
import prisma from '../../server';

const deleteThread = async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!id) return res.status(400).json({ message: 'Missing thread id' });
    if(isNaN(Number(id))) return res.status(400).json({ message: 'Invalid thread id' });

    if(!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const user = await prisma.user.findUnique({
        where: {
            userId: Number(req.user)
        }
    });

    const thread = await prisma.thread.findUnique({
        where: {
            threadId: Number(id)
        },
        include: {
            posts: true
        }
    });

    if (!thread) {
        return res.status(404).json({ message: 'Thread not found' });
    }

    if (user?.userId !== thread.userId && user?.isAdmin !== true) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // LOGGING
    console.log("Deleting thread: ", thread)
    thread.posts ? console.log("Deleting posts: ", thread.posts) : null;

    await prisma.post.deleteMany({
        where: {
            threadId: Number(id)
        }
    });

    await prisma.thread.delete({
        where: {
            threadId: Number(id)
        }
    });

    return res.status(200).json({ message: 'Thread deleted' });
}

export default deleteThread;