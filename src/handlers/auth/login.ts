import { Request, Response } from "express";
import prisma from "../../server";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

const login = async (req: Request, res: Response) => {
    const SECRET = process.env.JWT_SECRET;
    const REFRESH_SECRET = process.env.REFRESH_SECRET;
    const { login, password } = req.body as { login: string; password: string };

    const user = await prisma.user.findMany({
        // Will only return one as usernames and emails are unique
        where: {
            OR: [{ email: login }, { username: login }],
        },
    });

    if (user.length === 0) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }

    const validPassword = await bcrypt.compare(password, user[0].passwordHash);
    if (!validPassword) {
        res.status(401).json({ message: "Incorrect password" });
        return;
    }

    const accessToken = await new SignJWT({ userId: user[0].userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(new TextEncoder().encode(SECRET));

    // Create a refresh token
    const refreshToken = await new SignJWT({ userId: user[0].userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(new TextEncoder().encode(REFRESH_SECRET));

    await prisma.refreshToken.create({
        data: {
            refreshToken: refreshToken,
            user: {
                connect: {
                    userId: user[0].userId,
                },
            },
            creationDate: new Date(),
            expirationDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
            isRevoked: false,
        },
    });

    // Set Token Cookies
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

    // Update last login date
    await prisma.user.update({
        where: {
            userId: user[0].userId,
        },
        data: {
            lastLoginDate: new Date(),
        },
    });

    res.json({
        user: {
            username: user[0].username,
            email: user[0].email,
            registrationDate: user[0].registrationDate,
            lastLoginDate: user[0].lastLoginDate,
            isAdmin: user[0].isAdmin,
        },
    });
};

export default login;