import { Request, Response } from "express";
import prisma from "../../server";

const getUser = async (req: Request, res: Response) => {
    if (!req.params.id)
        return res.status(400).json({ error: "No user ID provided" });

    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({
        where: {
            userId: BigInt(id),
        },
        select: {
            userId: true,
            username: true,
            registrationDate: true,
            lastLoginDate: true,
            isAdmin: true,
            bio: true,
        },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
};

export default getUser;