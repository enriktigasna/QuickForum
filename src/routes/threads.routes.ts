import express from "express";
import { getThreads, getThread, getThreadPosts } from "../controllers/threads.controller";

const router = express.Router();

router.get('/', getThreads);
router.get('/:id', getThread);
router.get('/:id/posts', getThreadPosts);
// router.get('/:id/posts/:postId', getPost);
// router.get('/:id/posts/:postId/replies', getPostReplies);
// router.get('/:id/posts/:postId/replies/:replyId', getReply);

// router.post('/', createThread);
// router.post('/:id/posts', createPost);
// router.post('/:id/posts/:postId/replies', createReply);

export default router;