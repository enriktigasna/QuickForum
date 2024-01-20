import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getThreads = async (req: Request, res: Response) => {
    const { page, limit } = req.query;

    if (Number(limit) > 50) {
        res.json({ error: 'Limit cannot be greater than 50' });
    }

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    const threads = await prisma.thread.findMany({
        skip: offset,
        take: limitNumber,
    })

    res.json(threads);
}

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

const getThreadPosts = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if(!id) return res.status(400).json({ error: 'No thread ID provided' });

    const thread = await prisma.thread.findUnique({
        where: {
            threadId: id
        }
    })
    if(!thread) return res.status(404).json({ error: 'Thread not found' });

    const posts = await prisma.post.findMany({
        where: {
            threadId: id
        }
    })
    res.json(posts);
}

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

const getPostReplies = async (req: Request, res: Response) => {
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

    const replies = await prisma.reply.findMany({
        where: {
            postId: postId
        }
    })
    res.json(replies);
}

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

// Create thread, taking in a title and body.
// It creates a thread with given title, and a post with given body within the thread.
const createThread = async (req: Request, res: Response) => {
    if(!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { title, body, categoryId } = req.body;
    if(!title) return res.status(400).json({ error: 'No title provided' });
    if(!body) return res.status(400).json({ error: 'No body provided' });
    if(!categoryId || isNaN(Number(categoryId))) return res.status(400).json({ error: 'Invalid category ID provided' });

    const category = await prisma.category.findUnique({
        where: {
            categoryId: Number(categoryId)
        }
    });
    if(!category) return res.status(404).json({ error: 'Category not found' });

    const thread = await prisma.thread.create({
        data: {
            userId: req.user as number,
            title: title,
            categoryId: Number(categoryId),
            posts: {
                create: {
                    userId: req.user as number,
                    content: body,
                }
            }
        }
    });
    res.json(thread);
}

// Create post, taking in a body and a thread ID.
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

    const post = await prisma.post.create({
        data: {
            userId: req.user as number,
            threadId: id,
            content: body,
        }
    });

    res.json(post);
}

// Create reply, taking in a body, a thread ID, and a post ID.
// router.post('/:id/posts/:postId/replies', createReply);
const createReply = async (req: Request, res: Response) => {
    if(!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { body } = req.body;
    const id = Number(req.params.id);
    const postId = Number(req.params.postId);
    if(!id) return res.status(400).json({ error: 'No thread ID provided' });
    if(!postId) return res.status(400).json({ error: 'No post ID provided' });
    if(!body) return res.status(400).json({ error: 'No body provided' });

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

    const reply = await prisma.reply.create({
        data: {
            userId: req.user as number,
            postId: postId,
            content: body,
            replyDate: new Date(),
        }
    });
    
    res.json(reply);
}


export {
    getThreads,
    getThread,
    getThreadPosts,
    getThreadPost,
    getPostReplies,
    getPostReply,
    createThread,
    createPost,
    createReply
}