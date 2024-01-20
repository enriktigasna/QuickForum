import { Request, Response } from 'express';
import prisma from '../../server';

const updateThread = async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!id) return res.status(400).json({ message: 'Missing thread id' });
    if(isNaN(Number(id))) return res.status(400).json({ message: 'Invalid thread id' });

    const { title } = req.body;
    if(!title) return res.status(400).json({ message: 'Missing title' });
    if(typeof title !== 'string') return res.status(400).json({ message: 'Invalid title' });

    if(!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const user = await prisma.user.findUnique({
        where: {
            userId: Number(req.user)
        }
    });

    const thread = await prisma.thread.findUnique({
        where: {
            threadId: Number(id)
        }
    });

    if (!thread) {
        return res.status(404).json({ message: 'Thread not found' });
    }

    if (user?.userId !== thread.userId && user?.isAdmin !== true) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // LOGGING
    console.log("Updating thread: ", thread)

    await prisma.thread.update({
        where: {
            threadId: Number(id)
        },
        data: {
            title,
            isEdited: true,
            editDate: new Date()
        }
    });

    return res.status(200).json({ message: 'Thread updated' });
}

export default updateThread;