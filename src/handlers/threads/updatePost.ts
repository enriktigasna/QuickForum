import { Request, Response } from 'express';
import prisma from '../../server';

const updatePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!id) return res.status(400).json({ message: 'Missing thread id' });
    if(isNaN(Number(id))) return res.status(400).json({ message: 'Invalid thread id' });

    const { postId } = req.params;
    if(!postId) return res.status(400).json({ message: 'Missing post id' });
    if(isNaN(Number(postId))) return res.status(400).json({ message: 'Invalid post id' });

    const { body } = req.body;
    if(!body) return res.status(400).json({ message: 'Missing body' });
    if(typeof body !== 'string') return res.status(400).json({ message: 'Invalid body' });

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
            posts: {
                where: {
                    postId: Number(postId)
                }
            }
        }
    });

    if (!thread) {
        return res.status(404).json({ message: 'Thread not found' });
    }

    if (!thread?.posts) {
        return res.status(404).json({ message: 'Post not found' });
    }

    if (user?.userId !== thread.posts[0].userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // LOGGING
    console.log("Updating post: ", thread.posts[0])

    await prisma.post.update({
        where: {
            postId: Number(postId)
        },
        data: {
            content: body,
            isEdited: true,
            editDate: new Date()
        }
    });

    return res.status(200).json({ message: 'Post updated' });
}

export default updatePost;