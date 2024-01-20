import express from "express";
import { getThreads, getThread, getThreadPosts, getThreadPost, getPostReplies, createThread, createPost, createReply } from "../handlers/threads.handler";

const router = express.Router();

router.get('/', getThreads);
router.get('/:id', getThread);
router.get('/:id/posts', getThreadPosts);
router.get('/:id/:postId', getThreadPost);
router.get('/:id/:postId/replies', getPostReplies);

router.post('/', createThread);
router.post('/:id/posts', createPost);
router.post('/:id/:postId/replies', createReply);

// router.put('/:id', updateThread);
// router.put('/:id/posts/:postId', updatePost);

// router.delete('/:id', deleteThread);
// router.delete('/:id/posts/:postId', deletePost);

export default router;