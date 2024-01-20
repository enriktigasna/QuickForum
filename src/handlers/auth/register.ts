import { Request, Response } from "express";
import prisma from "../../server";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

const register = async (req: Request, res: Response) => {
    const SECRET = process.env.JWT_SECRET;
    const REFRESH_SECRET = process.env.REFRESH_SECRET;

    const { email, username, password } = req.body as {
        email: string;
        username: string;
        password: string;
    };

    // Check if user already exists
    const userExists = await prisma.user.findMany({
        where: {
            OR: [{ email: email }, { username: username }],
        },
    });

    if (userExists.length > 0) {
        res.status(400).json({ message: "User already exists" });
        return;
    }

    // Generate password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
        data: {
            email: email,
            username: username,
            passwordHash: hashedPassword,
            registrationDate: new Date(),
            lastLoginDate: new Date(),
            isAdmin: false,
        },
    });
    const accessToken = await new SignJWT({ userId: user.userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(new TextEncoder().encode(SECRET));

    const refreshToken = await new SignJWT({ userId: user.userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(new TextEncoder().encode(REFRESH_SECRET));

    await prisma.refreshToken.create({
        data: {
            refreshToken: refreshToken,
            user: {
                connect: {
                    userId: user.userId,
                },
            },
            creationDate: new Date(),
            expirationDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
            isRevoked: false,
        },
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/users/refresh",
    });

    res.cookie("accessToken", accessToken, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        path: "/",
        expires: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 hours
    });

    res.json({
        user: {
            username: user.username,
            email: user.email,
            registrationDate: user.registrationDate,
            lastLoginDate: user.lastLoginDate,
            isAdmin: user.isAdmin,
        },
    });
};

export default register;