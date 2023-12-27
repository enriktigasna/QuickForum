import express from "express";
import { getThreads, getThread, getThreadPosts } from "../controllers/threads.controller";

const router = express.Router();

router.get('/', getThreads);
router.get('/:id', getThread);
router.get('/:id/posts', getThreadPosts);

export default router;