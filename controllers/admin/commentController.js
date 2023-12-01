import { Comment } from "../../models/commentModel.js"
import { Subscriber } from "../../models/subscriberModel.js"
import asyncHandler from "express-async-handler"

/**
 * @desc    Get all comments
 * @route   GET /api/kbn/comments
 * @access  public
 */
const getComments = asyncHandler(async (req, res) => {
  // get all comments from DB
  const comments = await Comment.find({ postId: req.params.id})
  const all = []
  // loop all comments and extract comment id, post id & author {name, photo, admin ??} then push them to all array
  for (let i = 0; i < comments.length; i++) {
    const sub = await Subscriber.findById(comments[i].subscriber, 'username').exec()
    all.push({
      _id: comments[i]._id,
      subscriber: comments[i].suscriber,
      postId: comments[i].postId,
      comment: comments[i].comment,
      date: comments[i].updatedAt,
      subscriber: {
        _id: sub._id,
        username: sub.username
      }
    })
  }
  if (all.length === 0) {
    res.status(200).json({ message: "No comments at the moment" })
  } else {
    res.status(200).json(all)
  }
})

/**
 * @desc    Delete comment
 * @route   DELETE /api/kbn/comments
 * @access  private
 */
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id).exec()

  if (comment) {
    await comment.remove()
  }
  res.json({ message: "Deleted!" })
})

export {
  getComments,
  deleteComment
}