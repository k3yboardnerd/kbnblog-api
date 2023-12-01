import express from 'express'
import { deleteSubscriber, getSubscribers } from '../../controllers/admin/subscriberController.js'
import {protect} from '../../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(protect, getSubscribers)
router.route('/:id').delete(protect, deleteSubscriber)

export default router