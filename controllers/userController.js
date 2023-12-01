import asyncHandler from "express-async-handler"
import User from '../models/userModel.js'
import { generateToken } from "../utils/generateToken.js"
/**
 * @desc    Auth user/s token
 * @route   POST /api/users/auth
 * @access  public
 */
const authUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body

  if (!(email || password)) {
    res.status(400)
    throw new Error("All fields must filled!!")
  }

  const user = await User.findOne({ email })

  if (user && (await user.matchPasswords(password))) {
    generateToken(res, user._id)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      admin: user.admin,
      email: user.email,
      photo: user.photo.toString()
    })
  } else {
    res.status(401)
    throw new Error("Invalid user email or password")
  }

})

/**
 * @desc    Register a new user
 * @route   POST /api/users/
 * @access  public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  
  if (!(name || email || password)) {
    res.status(400)
    throw new Error("Please fill all fields")
  }

  const UserExists = await User.findOne({ email: email })
  
  if (UserExists) {
    res.status(400)
    throw new Error("User already exist!")
  }

  const user = await User.create({
    name,
    email,
    password
  })

  if (user) {
    generateToken(res, user._id)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      admin: user.admin,
      photo: user.photo.toString()
    })
  } else {
    res.status(400)
    throw new Error("Invalid user data")
  }

})

/**
 * @desc    Logout user
 * @route   GET /api/users/logout
 * @access  public
 */
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  })
  res.status(200).json({message: 'User Logged Out'})
})

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    admin: req.user.admin
  }
  res.status(200).json(user)
})

/**
 * @desc    Get about kbn.
 * @route   GET /api/users/about
 * @access  private
 */
const getAboutAuthor = asyncHandler(async (req, res) => {
  const author = await User.findById('6536bdc36e4db012adf45953', 'photo').exec()

  if (author) {
    res.status(200).json({
      photo: author.photo.toString()
    })
  } else {
    res.status(400)
    throw new Error("Something bad happened!")
  }
})

/**
 * @desc    Send message to author
 * @route   POST /api/users/about
 * @access  private
 */
// TBD

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  
  const user = await User.findById(req.user._id)

  if (user) { 
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.photo = req.body.photo || user.photo

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      admin: updateUser.admin,
      email: updatedUser.email,
      photo: updatedUser.photo.toString()
    })
  } else {
    res.status(404)
    throw new Error('User does not exist')
  }
})

/**
 * @desc    Update user photo
 * @route   PUT /api/users/profile/photo
 * @access  private
 */
const updateUserPhoto = asyncHandler(async (req, res) => {
  const { photo } = req.body
  
  const user = await User.findById(req.user._id)

  if (user) { 
    
    user.photo = photo || user.photo
    
    const updatedUser = await user.save()

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      admin: updatedUser.admin,
      photo: updatedUser.photo.toString()
    })
  } else {
    res.status(404)
    throw new Error('User does not exist')
  }
})

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updateUserPhoto,
  getAboutAuthor
}