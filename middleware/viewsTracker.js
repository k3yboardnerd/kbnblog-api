import { Subscriber } from "../models/subscriberModel.js"
import { Post } from "../models/postModel.js" 
import asyncHandler from "express-async-handler"

/**
 * @desc    This middleware tracks viewed posts for the user
 */
export const viewsTracker = asyncHandler(async (req, res, next) => {
  const { _id } = req.subscriber
  const { id } = req.params

  const subscriber = await Subscriber.findById(_id)
  if (!subscriber) {
    res.status(404)
    throw new Error('Subscriber not found')
    next()
  }

  // Update the views of the subscriber
  subscriber.views.push({ postId: id, viewedOn: Date.now() })
  await subscriber.save()

  // Update the views of the post
  const post = await Post.findById(id)
  if (!post) {
    res.status(404)
    throw new Error('Post not found')
    next()
  }
  post.views += 1
  await post.save()
  next()
})


