import { Subscriber } from "../models/subscriberModel.js"
import { Post } from "../models/postModel.js" 
import asyncHandler from "express-async-handler"

/**
 * @desc    This middleware tracks viewed posts for the user
 */
export const viewsTracker = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { postId } = req.body

  const subscriber = await Subscriber.findById(id)
  if (!subscriber) {
    res.status(404)
    throw new Error('Subscriber not found')
  }

  // Update the views of the subscriber
  subscriber.views.push({ postId, viewedOn: Date.now() })
  await subscriber.save()

  // Update the views of the post
  const post = await Post.findById(postId)
  if (!post) {
    res.status(404)
    throw new Error('Post not found')
  }
  post.views += 1
  await post.save()
})


