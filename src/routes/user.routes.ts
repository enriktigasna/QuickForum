import express from 'express';
import { register, login, refreshToken } from '../handlers/auth.handler';
import { loginValidation, refreshValidation, registerValidation } from '../validation/auth.validation';
import { getMe, getUser, getUserPosts, getUserPostReplies, getUserThreads, getUsers } from '../handlers/users.handler';

const router = express.Router();

// VALIDATION
router.get('/', getUsers)
router.post('/register', registerValidation);
router.post('/login', loginValidation);
router.post('/refresh', refreshValidation);


// ROUTES
router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refreshToken)

router.get('/me', getMe)

router.get('/:id/replies', getUserPostReplies);
router.get('/:id/posts', getUserPosts);
router.get('/:id/threads', getUserThreads);
router.get('/:id', getUser);

export default router;