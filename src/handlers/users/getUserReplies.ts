import { Request, Response } from "express";
import prisma from "../../server";

const getUserReplies = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({
        where: {
            userId: BigInt(id),
        },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    const replies = await prisma.reply.findMany({
        where: {
            userId: BigInt(id),
        },
    });
    res.json(replies);
};

export default getUserReplies;