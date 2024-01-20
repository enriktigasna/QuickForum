import { Request, Response } from 'express';
import prisma from '../../server';

const createPost = async (req: Request, res: Response) => {
    if(!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { body } = req.body;
    const id = Number(req.params.id);
    if(!id) return res.status(400).json({ error: 'No thread ID provided' });
    if(!body) return res.status(400).json({ error: 'No body provided' });

    const thread = await prisma.thread.findUnique({
        where: {
            threadId: id
        }
    })
    if(!thread) return res.status(404).json({ error: 'Thread not found' });
    if(thread.isLocked) return res.status(403).json({ error: 'Thread is locked' });

    const post = await prisma.post.create({
        data: {
            userId: req.user as number,
            threadId: id,
            content: body,
        }
    });

    res.json(post);
}

export default createPost;