import express from "express";
import { getCategories, getLatestPost } from "../handlers/categories.handler";

const router = express.Router();

router.get("/", getCategories)
router.get("/latest", getLatestPost)

export default router;