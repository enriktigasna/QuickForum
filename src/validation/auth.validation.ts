import { NextFunction, Request, Response } from "express";


const registerValidation = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.username) {
        res.status(400).json({message: "No username provided"});
        return;
    }
    if(!req.body.email) {
        res.status(400).json({message: "No email provided"});
        return;
    }
    if(!req.body.password) {
        res.status(400).json({message: "No password provided"});
        return;
    }

    // Email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
        res.status(400).json({message: "Invalid email format"});
        return;
    }

    // Password length check
    if (req.body.password.length < 6) {
        res.status(400).json({message: "Password must be at least 6 characters"});
        return;
    }

    // Username validation regex pattern
    const usernameRegex = /^[A-Za-z0-9.]+$/;
    if (!usernameRegex.test(req.body.username)) {
        res.status(400).json({message: "Username can only contain uppercase and lowercase letters, numbers, and dot (.)"});
        return;
    }

    next();
}

const loginValidation = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.login) {
        res.status(400).json({message: "No login provided"});
        return;
    }
    if(!req.body.password) {
        res.status(400).json({message: "No password provided"});
        return;
    }

    next();
}
const refreshValidation = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.refreshToken) {
      res.status(401).json({ message: "No refresh token provided" });
      return;
    }
    next();
}
export {
    registerValidation,
    loginValidation,
    refreshValidation
}