import { Message } from "../models/messageModel.js";
import { Subscriber } from "../models/subscriberModel.js";
import asynchandler from "express-async-handler"

/**
 * @desc    Create new message
 * @route   POST /api/messages/
 * @access  public
 */
export const sendMessage = asynchandler(async (req, res) => {
  // extract subscriber id and message text
  const {subscriber, text, subject} = req.body

  // find subscriber by Id
  const subscriberExists = await Subscriber.findById(subscriber)

  // check if subscriber exists
  if (subscriberExists && subscriberExists.donationTotal >= 2) {
    // create a new meesage
    const message = await Message.create({ subscriber, text, subject })
    // respond with success
    res.status(201).json({message: "Message sent!"})
  } else {
    res.status(400)
    // respond with an error
    throw new Error("Sorry, you can't send this message!")
  }
})