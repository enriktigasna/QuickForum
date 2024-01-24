import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import users from './routes/user.routes';
import threads from './routes/threads.routes';
import categories from './routes/categories.routes';
import verifyToken from './helpers/verifyToken.middleware';
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
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
app.use("/categories/", categories);


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
