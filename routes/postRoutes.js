import express from "express"
import { getAllPosts, getPostById, createNewPost, updatePost, deletePost } from "../controllers/postController.js"
import { protect } from "../middleware/authMiddleware.js"
import { viewsTracker } from "../middleware/viewsTracker.js"
// import { viewsCounter } from "../middleware/postViewsMiddleware.js"
// import { postsLikesCounter } from "../middleware/postLikesMiddleware.js"

const router = express.Router()

router.route("/").get(getAllPosts).post(protect, createNewPost)
router.route("/:id/:subId").get(getPostById, viewsTracker).delete(protect, deletePost)
router.route("/:id/edit").put(protect, updatePost)

export default router