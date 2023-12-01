import express from "express"
import { protect } from "../../middleware/authMiddleware.js"
import { deleteComment, getComments } from "../../controllers/admin/commentController.js"

const router = express.Router()

router.route('/:id').delete(protect, deleteComment).get(protect, getComments)

export default router