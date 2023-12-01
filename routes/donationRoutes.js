import { donate } from "../controllers/donationController.js"
import express from 'express'

const router = express.Router()

router.route('/').post(donate)

export default router