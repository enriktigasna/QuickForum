import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import { getMe, getUser, getUserPosts, getUserReplies, getUserThreads, getUsers, loginUser, registerUser, validateUser } from './controllers/users.controller';
import { getThread, getThreadPosts, getThreads } from './controllers/threads.controller';

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


// Gets many users
// Takes limit and page as query parameters
app.get('/users', getUsers);

// Get me
app.get('/users/me', getMe);

// Registers a new user
// Takes email, username, and password as body parameters
app.post ('/users/register', registerUser);

// Logs in a user
// Takes login (username/mail) and password as body parameters
app.post('/users/login', loginUser);

// Validate user token
// Takes token as body parameter
// Returns user ID
app.post('/users/validate', validateUser);

// Gets user by ID
// KEEP IN MIND TO HAVE DYNAMIC ROUTES AT THE BOTTOM
app.get('/users/:id', getUser);

// User Resources
app.get('/users/:id/threads', getUserThreads);
app.get('/users/:id/posts', getUserPosts);
app.get('/users/:id/replies', getUserReplies);

// Gets many threads
// Takes limit and page as query parameters
app.get('/threads', getThreads);

// Gets thread by ID
app.get('/threads/:id', getThread);

// Get thread resources
app.get('/threads/:id/posts', getThreadPosts);



app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
