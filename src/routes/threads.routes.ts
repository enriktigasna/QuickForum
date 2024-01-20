import express from "express";
import { getThreads, getThread, getThreadPosts, getThreadPost, getPostReplies, getPostReply, createThread, createPost, createReply } from "../controllers/threads.controller";

const router = express.Router();

router.get('/', getThreads);
router.get('/:id', getThread);
router.get('/:id/posts', getThreadPosts);
router.get('/:id/:postId', getThreadPost);
router.get('/:id/:postId/replies', getPostReplies);
router.get('/:id/:postId/:replyId', getPostReply);

router.post('/', createThread);
router.post('/:id/posts', createPost);
router.post('/:id/:postId/replies', createReply);

// router.put('/:id', updateThread);
// router.put('/:id/posts/:postId', updatePost);
// router.put('/:id/posts/:postId/replies/:replyId', updateReply);

// router.delete('/:id', deleteThread);
// router.delete('/:id/posts/:postId', deletePost);
// router.delete('/:id/posts/:postId/replies/:replyId', deleteReply);

export default router;