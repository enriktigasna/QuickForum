import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { SignJWT } from 'jose';


const prisma = new PrismaClient();

const SECRET = process.env.JWT_SECRET;

const authenticateUser = async (login: string, password: string) => {
    let user;

    if (login.includes('@')) {
        user = await prisma.user.findUnique({
            where: { email: login },
        });
    } else {
        user = await prisma.user.findUnique({
            where: { username: login }
        });
    }

    if (!user) {
        throw new Error('User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
        throw new Error('Password is incorrect');
    }
    // Generate JWT
    const jwt = await new SignJWT({ userId: user.userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h') // Set token expiration (e.g., 2 hours)
        .sign(new TextEncoder().encode(SECRET));

    return jwt;
};

export { authenticateUser };