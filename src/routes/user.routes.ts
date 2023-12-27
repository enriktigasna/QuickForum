import { getMe, getUser, getUserPosts, getUserReplies, getUserThreads, getUsers, loginUser, registerUser, validateUser } from '../controllers/users.controller';
import express from 'express';

const router = express.Router();

router.get('/', getUsers);

router.post ('/register', registerUser);
router.post('/login', loginUser);
router.post('/validate', validateUser);
router.get('/me', getMe);

router.get('/:id', getUser);
router.get('/:id/threads', getUserThreads);
router.get('/:id/posts', getUserPosts);
router.get('/:id/replies', getUserReplies);

export default router;