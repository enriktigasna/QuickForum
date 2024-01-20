import { Request, Response } from 'express';
import prisma from '../../server';

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