import { Message } from "../../models/messageModel.js"
import { Subscriber } from "../../models/subscriberModel.js"
import asynchandler from "express-async-handler"

/**
 * @desc    Gets all messages
 * @route   GET /api/messages/
 * @access  private
 */
export const getAllMessages = asynchandler(async (req, res) => {
  const msgs = []
  // check if the admin is logged in
  if (req.user._id) {
    // get all messages
    const messages = await Message.find({}).sort({createdAt: -1})
    // loop all messages
    for (let i = 0; i < messages.length; i++) {
      // get a subscriber that sent the message
      const subscriber = await Subscriber.findById(messages[i].subscriber)
      // push all messages to the msgs array
      msgs.push({
        id: messages[i]._id,
        subject: messages[i].subject,
        text: messages[i].text,
        date: messages[i].createdAt,
        subscriber: {
          _id: subscriber._id,
          username: subscriber.username,
          email: subscriber.email
        }
      })
    }
    // respond with the msgs
    res.status(200).json(msgs)
  } else {
    res.status(400)
    // respond with an error
    throw new Error("Unauthorized!")
  }
})