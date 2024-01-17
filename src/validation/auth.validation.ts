import { NextFunction, Request, Response } from "express";

const refreshValidation = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies.refreshToken) {
    res.status(401).json({ message: "No refresh token provided" });
    return;
  }
  next();
}

const registerValidation = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.username) {
        res.status(400).json({message: "No username provided"})
        return;
    }
    if(!req.body.email) {
        res.status(400).json({message: "No email provided"})
        return;
    }
    if(!req.body.password) {
        res.status(400).json({message: "No password provided"})
        return;
    }
    next();
}
export {
    registerValidation,
    refreshValidation
}