import { Request, Response } from 'express';
import prisma from '../../server';

const deletePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!id) return res.status(400).json({ message: 'Missing thread id' });
    if(isNaN(Number(id))) return res.status(400).json({ message: 'Invalid thread id' });

    const { postId } = req.params;
    if(!postId) return res.status(400).json({ message: 'Missing post id' });
    if(isNaN(Number(postId))) return res.status(400).json({ message: 'Invalid post id' });

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

    if (user?.userId !== thread.posts[0].userId && user?.isAdmin !== true) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // LOGGING
    console.log("Deleting post: ", thread.posts[0])

    await prisma.post.delete({
        where: {
            postId: Number(postId)
        }
    });

    return res.status(200).json({ message: 'Post deleted' });
}

export default deletePost;