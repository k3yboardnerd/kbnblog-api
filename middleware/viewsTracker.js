import { Subscriber } from "../models/subscriberModel.js"
import { Post } from "../models/postModel.js" 
import asyncHandler from "express-async-handler"

/**
 * @desc    This middleware tracks viewed posts for the user
 */
export const viewsTracker = asyncHandler(async (req, res, next) => {
  const { id, subId } = req.params

  const subscriber = await Subscriber.findById(subId)
  if (!subscriber) {
    res.status(404)
    throw new Error('Subscriber not found')
    next()
  }

  // Check if the post has already been viewed by the subscriber
  const postViewed = subscriber.views.some(view => view.postId.toString() === id)
  if (!postViewed) {
    // If the post has not been viewed yet, add it to the views of the subscriber
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
  }
  next()
})
