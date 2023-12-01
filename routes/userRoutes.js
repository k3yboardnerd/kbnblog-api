import express from "express"
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updateUserPhoto,
  getAboutAuthor
} from '../controllers/userController.js'
import {protect} from "../middleware/authMiddleware.js"

const router = express.Router()

// Post
router.post('/', registerUser)
router.get('/about', getAboutAuthor)
router.post('/auth', authUser)
router.post('/logout', logoutUser)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)
router.route('/profile/photo').put(protect, updateUserPhoto)

export default router