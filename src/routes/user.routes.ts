import express from 'express';
import { register, login, refreshAccessToken } from '../controllers/auth.controller';
import { loginValidation, refreshValidation, registerValidation } from '../validation/auth.validation';
import { getMe, getUser, getUsers } from '../controllers/users.controller';

const router = express.Router();

// VALIDATION
router.post('/register', registerValidation);
router.post('/login', loginValidation);
router.post('/refresh', refreshValidation);


// ROUTES
router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refreshAccessToken)

router.get('/me', getMe)
router.get('/list', getUsers)

router.get('/:id', getUser);

/*
router.get('/', getUsers);

router.post ('/register', registerUser);
router.post('/login', loginUser);
router.post('/validate', validateUser);
router.get('/me', getMe);

router.get('/:id', getUser);
router.get('/:id/threads', getUserThreads);
router.get('/:id/posts', getUserPosts);
router.get('/:id/replies', getUserReplies);*/

export default router;