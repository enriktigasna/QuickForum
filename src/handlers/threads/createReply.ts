import { Request, Response } from 'express';
import prisma from '../../server';

const createReply = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const postId = Number(req.params.postId);
    const { body } = req.body;
    if(!id) return res.status(400).json({ error: 'No thread ID provided' });
    if(!postId) return res.status(400).json({ error: 'No post ID provided' });
    if(!body) return res.status(400).json({ error: 'No body provided' });

    const thread = await prisma.thread.findUnique({
        where: {
            threadId: id
        }
    })
    if(!thread) return res.status(404).json({ error: 'Thread not found' });
    if(thread.isLocked) return res.status(403).json({ error: 'Thread is locked' });

    const post = await prisma.post.findUnique({
        where: {
            postId: postId
        }
    })
    if(!post) return res.status(404).json({ error: 'Post not found' });

    const reply = await prisma.post.create({
        data: {
            userId: req.user as number,
            threadId: id,
            replyToId: post.postId,
            content: body,
        }
    });

    res.json(reply);
}

export default createReply;