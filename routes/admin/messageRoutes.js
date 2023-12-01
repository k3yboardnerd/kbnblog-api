import express from 'express'
import { getAllMessages } from '../../controllers/admin/messageController.js'
import { protect } from '../../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(protect, getAllMessages)

export default router