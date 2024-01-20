import { Request, Response } from 'express';
import prisma from '../../server';

const getPostReply = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const postId = Number(req.params.postId);
    const replyId = Number(req.params.replyId);
    if(!id) return res.status(400).json({ error: 'No thread ID provided' });
    if(!postId) return res.status(400).json({ error: 'No post ID provided' });
    if(!replyId) return res.status(400).json({ error: 'No reply ID provided' });

    const thread = await prisma.thread.findUnique({
        where: {
            threadId: id
        }
    })
    if(!thread) return res.status(404).json({ error: 'Thread not found' });

    const post = await prisma.post.findUnique({
        where: {
            postId: postId
        }
    })
    if(!post) return res.status(404).json({ error: 'Post not found' });

    const reply = await prisma.reply.findUnique({
        where: {
            replyId: replyId
        }
    })
    if(!reply) return res.status(404).json({ error: 'Reply not found' });

    res.json(reply);
}