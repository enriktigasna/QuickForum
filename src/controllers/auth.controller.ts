import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { SignJWT, jwtVerify } from "jose";

const register = async (req: Request, res: Response) => {
  const SECRET = process.env.JWT_SECRET;
  const REFRESH_SECRET = process.env.REFRESH_SECRET;

  const prisma = new PrismaClient();
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
  const accessToken = await new SignJWT({ userID: user.userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(new TextEncoder().encode(SECRET));

  const refreshToken = await new SignJWT({ userID: user.userId })
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

const login = async (req: Request, res: Response) => {
  const SECRET = process.env.JWT_SECRET;
  const REFRESH_SECRET = process.env.REFRESH_SECRET;
  const prisma = new PrismaClient();
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

  const accessToken = await new SignJWT({ userID: user[0].userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(new TextEncoder().encode(SECRET));

  // Create a refresh token
  const refreshToken = await new SignJWT({ userID: user[0].userId })
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

const refreshAccessToken = async (req: Request, res: Response) => {
  const SECRET = process.env.JWT_SECRET;
  const REFRESH_SECRET = process.env.REFRESH_SECRET;

  const prisma = new PrismaClient();
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
  const accessToken = await new SignJWT({ userID: refreshTokenData.userId })
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

export { register, login, refreshAccessToken };
