import { Request, Response } from 'express';
import prisma from '../../server';

const getThreadPost = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const postId = Number(req.params.postId);
    if(!id) return res.status(400).json({ error: 'No thread ID provided' });
    if(!postId) return res.status(400).json({ error: 'No post ID provided' });

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

    res.json(post);
}

export default getThreadPost;