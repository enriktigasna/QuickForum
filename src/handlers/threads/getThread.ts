import e, { Request, Response } from 'express';
import prisma from '../../server';

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

export default getThread;