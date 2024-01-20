import { Request, Response } from "express";
import prisma from "../../server";

const getMe = async (req: Request, res: Response) => {
    const userId = req.user as number;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await prisma.user.findUnique({
        where: { userId },
        select: {
            userId: true,
            email: true,
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

export default getMe;