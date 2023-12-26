import { jwtVerify } from "jose";

const SECRET = process.env.JWT_SECRET;

const validateToken = async (token: string): Promise<number | null> => {
    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(SECRET));
        return payload.userId as number;
    } catch (error) {
        return null; // or throw an error, depending on how you want to handle it
    }
};

export { validateToken };
