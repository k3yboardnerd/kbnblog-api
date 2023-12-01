import express from "express"
import { subscription, unsubscription } from "../controllers/subscriberController.js"

const router = express.Router()

router.route('/').post(subscription)
router.route('/:id').delete(unsubscription)

export default router