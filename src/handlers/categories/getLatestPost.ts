import { Request, Response } from "express";
import prisma from "../../server";

const getLatestPost = async (req: Request, res: Response) => {
    const latestPost = await prisma.post.findFirst({
        orderBy: {
            postDate: "desc",
        },
        select: {
            content: true,
            postDate: true,
            editDate: true,
            thread: {
                select: {
                    title: true,
                    threadId: true,
                    category: {
                        select: {
                            categoryName: true,
                            categoryId: true,
                        },
                    },
                },
            },
            user: {
                select: {
                    username: true,
                    userId: true,
                },
            },
        },
    })

    res.json(latestPost);
};

export default getLatestPost;