import express from 'express';
import { register, login, refreshAccessToken } from '../controllers/auth.controller';
import { loginValidation, refreshValidation, registerValidation } from '../validation/auth.validation';
import { getMe, getUser, getUserPosts, getUserReplies, getUserThreads, getUsers } from '../handlers/users.handler';

const router = express.Router();

// VALIDATION
router.get('/', getUsers)
router.post('/register', registerValidation);
router.post('/login', loginValidation);
router.post('/refresh', refreshValidation);


// ROUTES
router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refreshAccessToken)

router.get('/me', getMe)

router.get('/:id/replies', getUserReplies);
router.get('/:id/posts', getUserPosts);
router.get('/:id/threads', getUserThreads);
router.get('/:id', getUser);

export default router;