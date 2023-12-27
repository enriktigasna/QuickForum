import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import users from './routes/user.routes';
import threads from './routes/threads.routes';

const app = express();
const port = 3000;

app.use(express.json());

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
