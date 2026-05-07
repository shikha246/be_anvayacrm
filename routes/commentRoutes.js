import express from "express";
import {
 addComment,
} from "../controllers/addCommentController.js";

const router = express.Router();
router.post("/leads/:id/comments", addComment);






export default router;