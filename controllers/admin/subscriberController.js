import { Donation } from '../../models/donationModel.js'
import { Subscriber } from '../../models/subscriberModel.js'
import { Comment } from '../../models/commentModel.js'
import User from '../../models/userModel.js'
import asyncHandler from 'express-async-handler'

/**
 * @desc    Get all subscribers
 * @route   GET /kbn/api/subscribers
 * @access  private
 */
const getSubscribers = asyncHandler(async (req, res) => {
  // Check if the requesting user/stuff is logged in
  if (req.user._id) {
    // find the user by id
    const user = await User.findById(req.user._id, 'admin').exec()
    // check user exists?
    if (user) {
      // check if user is admin
      if (user.admin) {
        // find all subscribers
        const subs = await Subscriber.find({}).sort({donationTotal: -1}).select('-views -__v')
        // check if are there any subs
        if (subs.length === 0) {
          res.status(400).json({message: "There are no subscribers at the moment!"})
        }
        // give them back
        res.status(200).json(subs)
      } else {
        res.status(400)
        throw new Error("Unauthorized!")
      }
    } else {
      res.status(400)
      throw new Error("User does not exist!")
    }
  } else {
    res.status(400)
    throw new Error("Unauthorized, not logged in!")
  }
})

/**
 * @desc    Delete a subscriber
 * @route   DELETE /kbn/api/subscribers/:id
 * @access  private
 */
const deleteSubscriber = asyncHandler(async (req, res) => {
  const { id } = req.params
  
  // Check if the requesting user/stuff is logged in
  if (req.user._id) {
    // find the user by id
    const user = await User.findById(req.user._id, 'admin').exec()
    // check user exists?
    if (user) {
      // check if user is admin
      if (user.admin) {
        // find the subscriber
        const sub = await Subscriber.findById(id).exec()
        // check if sub exists
        if (sub) {
          // find all comments and delete
          await Comment.deleteMany({ subscriber: id })
          // delete subscriber
          await Subscriber.findByIdAndDelete(id)
          // confirmation
          res.status(200).json({message: "Subscriber deleted!"})
        } else {
          res.status(500)
          throw new Error("Something bad happened.")
        }
      } else {
        res.status(400)
        throw new Error("Unauthorized!")
      }
    } else {
      res.status(400)
      throw new Error("User does not exist!")
    }
  } else {
    res.status(400)
    throw new Error("Unauthorized, not logged in!")
  }
})

export {
  getSubscribers,
  deleteSubscriber
}