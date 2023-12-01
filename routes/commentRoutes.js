import express from "express"
// import { protect } from "../middleware/authMiddleware.js"
import { getComments, getCommentById, createComment, deleteComment } from "../controllers/commentController.js"

const router = express.Router()

router.route('/').post(createComment)
router.route('/:id').get(getComments).delete(deleteComment)
router.route('/comment/:id').get(getCommentById)

export default router