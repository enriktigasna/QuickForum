import { Request, Response } from "express";
import prisma from "../../server";
import { SignJWT, jwtVerify } from "jose";

const refreshToken = async (req: Request, res: Response) => {
    const SECRET = process.env.JWT_SECRET;
    const REFRESH_SECRET = process.env.REFRESH_SECRET;

    const refreshToken = req.cookies.refreshToken;

    const refreshTokenData = await prisma.refreshToken.findUnique({
        where: {
            refreshToken: refreshToken,
        },
    });

    if (!refreshTokenData) {
        res.status(401).json({ message: "Invalid refresh token" });
        return;
    }

    if (refreshTokenData.isRevoked) {
        res.status(401).json({ message: "Refresh token has been revoked" });
        return;
    }

    if (new Date() > refreshTokenData.expirationDate) {
        res.status(401).json({ message: "Refresh token has expired" });
        return;
    }
    // Cryptographically validate the refresh token
    try {
        await jwtVerify(
            refreshToken,
            new TextEncoder().encode(REFRESH_SECRET)
        );
    } catch (err) {
        res.status(401).json({ message: "Invalid refresh token" });
        return;
    }

    // Generate a new access token
    const accessToken = await new SignJWT({ userId: refreshTokenData.userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(new TextEncoder().encode(SECRET));

    res.cookie("accessToken", accessToken, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        path: "/",
        expires: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 hours
    });

    res.json({
        accessToken: accessToken,
    });
};

export default refreshToken;