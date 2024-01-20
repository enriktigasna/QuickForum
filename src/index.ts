import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import users from './routes/user.routes';
import threads from './routes/threads.routes';
import verifyToken from './helpers/verifyToken.middleware';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(require("cookie-parser")());
app.use(verifyToken);

const prisma = new PrismaClient();

declare global {
    interface BigInt {
        toJSON(): string;
    }
}

BigInt.prototype.toJSON = function() {
    return this.toString();
};


app.use("/threads/", threads);
app.use("/users/", users);


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
