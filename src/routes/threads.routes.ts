import express from "express";
import { getThreads, getThread, getThreadPosts, getThreadPost, getPostReplies, createThread, createPost, createReply, deleteThread, updatePost, updateThread } from "../handlers/threads.handler";
import { deletePost } from "../handlers/users.handler";

const router = express.Router();

router.get('/', getThreads);
router.get('/:id', getThread);
router.get('/:id/posts', getThreadPosts);
router.get('/:id/:postId', getThreadPost);
router.get('/:id/:postId/replies', getPostReplies);

router.post('/', createThread);
router.post('/:id/posts', createPost);
router.post('/:id/:postId/replies', createReply);

router.put('/:id', updateThread);
router.put('/:id/:postId', updatePost);

router.delete('/:id', deleteThread);
router.delete('/:id/:postId', deletePost);

export default router;