import { Subscriber } from "../models/subscriberModel.js";
import asyncHandler from "express-async-handler"


/**
 * @desc    Subscription route
 * @route   POST /api/subs/
 * @access  public
 */
const subscription = asyncHandler(async (req, res) => {
  const { username, email } = req.body

  // check is all fields were filled
  if (!(username || email)) {
    res.status(400)
    throw new Error("Please fill all fields!")
  }

  // check if already subscribed or email exists
  const alreadySubscribed = await Subscriber.findOne({ email, username })
  const emailExists = await Subscriber.findOne({ email })

  if (alreadySubscribed) {
    // respond with user details
    res.status(200).json({
      _id: alreadySubscribed._id,
      username: alreadySubscribed.username,
      email: alreadySubscribed.email,
      views: alreadySubscribed.views,
      donationTotal: alreadySubscribed.donationTotal
    })
  }
  
  if (emailExists) {
    // throw an error!
    res.status(400)
    throw new Error("Email or Username already exists, please use another email instead or input registered username to continue.")
  } 
  
  // if user is new then create
  const sub = await Subscriber.create({ email, username })
  
  // check if user was created then respond with their detials
  if (sub) {
    res.status(201).json({
      _id: sub._id,
      username: sub.username,
      email: sub.email,
      views: sub.views,
      donationTotal: sub.donationTotal
    })
  } else {
    res.status(500)
    throw new Error("Something went wrong while subscribing. Please refresh and try again, or try again later.")
  }
})

/**
 * @desc    Unsubscribe route
 * @route   DELETE /api/subs/:id
 * @access  public
 */
const unsubscription = asyncHandler(async (req, res) => {
  const { id } = req.params
  
  const userExists = await Subscriber.findById({ _id: id })
  
  if (userExists) {
    await userExists.remove()
  } else {
    res.status(500)
    throw new Error("You've already unsubscribed!")
  }
})


export {subscription, unsubscription}
