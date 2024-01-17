import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

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

const getUsers = async (req: Request, res: Response) => {
  const { page, limit } = req.query;

  if (Number(limit) > 50) {
    res.json({ error: "Limit cannot be greater than 50" });
  }

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const offset = (pageNumber - 1) * limitNumber;

  prisma.user
    .findMany({
      skip: offset,
      take: limitNumber,
      select: {
        userId: true,
        username: true,
        registrationDate: true,
        lastLoginDate: true,
        isAdmin: true,
        bio: true,
      },
      orderBy: {
        lastLoginDate: "desc",
      },
    })
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.json(error);
    });
};

const getMe = async (req: Request, res: Response) => {
  const userId = req.user as number;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const user = await prisma.user.findUnique({
    where: { userId },
    select: {
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

// User resources

const getUserThreads = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: {
      userId: BigInt(id),
    },
  });
  if (!user) return res.status(404).json({ error: "User not found" });

  const threads = await prisma.thread.findMany({
    where: {
      userId: BigInt(id),
    },
  });
  res.json(threads);
};

const getUserPosts = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: {
      userId: BigInt(id),
    },
  });
  if (!user) return res.status(404).json({ error: "User not found" });

  const posts = await prisma.post.findMany({
    where: {
      userId: BigInt(id),
    },
  });
  res.json(posts);
};

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

export {
  getUser,
  getUsers,
  getMe,
  getUserThreads,
  getUserPosts,
  getUserReplies,
};
