import { Request, Response, NextFunction } from "express";
import { JWTPayload, JWTVerifyResult, jwtVerify } from "jose";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.accessToken) {
        return next();
    }
    const accessToken = req.cookies.accessToken;
    const SECRET = process.env.JWT_SECRET;

    jwtVerify(accessToken, new TextEncoder().encode(SECRET), {
        algorithms: ["HS256"],
    })
        .then((payload: JWTVerifyResult) => {
            const userId: number = payload.payload.userID as number;
            req.user = userId;
            next();
        })
        .catch((err) => {
            res.status(401).json({ message: "Invalid access token" });
        });
}

export default verifyToken;