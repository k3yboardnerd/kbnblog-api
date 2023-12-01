import { getPosts, createPost, deletePost, updatePost, getPostById } from "../../controllers/admin/postController.js";
import express from 'express'
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router()

router.route('/').get(protect, getPosts).post(protect, createPost)
router.route("/:id").get(protect, getPostById).delete(protect, deletePost)
router.route("/:id/edit").put(protect, updatePost)
export default router