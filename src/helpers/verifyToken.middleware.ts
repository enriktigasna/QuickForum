import { Request, Response, NextFunction } from "express";
import { jwtVerify } from "jose";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.accessToken) {
        return next();
    }
    const accessToken = req.cookies.accessToken;
    const SECRET = process.env.JWT_SECRET;

    jwtVerify(accessToken, new TextEncoder().encode(SECRET))
        .then((payload) => {
            req.user = payload;
            next();
        })
        .catch((err) => {
            res.status(401).json({ message: "Invalid access token" });
        });
}