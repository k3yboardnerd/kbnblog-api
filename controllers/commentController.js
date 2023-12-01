import asyncHandler from "express-async-handler"
import { Post } from "../models/postModel.js"
import { Comment } from "../models/commentModel.js"
import { Subscriber } from "../models/subscriberModel.js"

/**
 * @desc    Get all comments
 * @route   GET /api/comments
 * @access  public
 */
const getComments = asyncHandler(async (req, res) => {
  // get all comments from DB
  const comments = await Comment.find({ postId: { $eq: req.params.id } })
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
 * @desc    Get comment by ID
 * @route   GET /api/comments/:id
 * @access  private
 */
const getCommentById = asyncHandler(async (req, res) => {
  const comment = Comment.findById(req.params.id, '_id comment subscriber').exec()
  if (comment) {
    res.status(200).json({
      _id: comment._id,
      comment: comment.comment
    })
  } else {
    res.status(400)
    throw new Error("Cannot edit this comment")
  }
})

/**
 * @desc    Create comment
 * @route   POST /api/comments
 * @access  private
 */
const createComment = asyncHandler(async (req, res) => {
  const { postId, comment, subscriber } = req.body

  // check if all fields are filled and if user is logged in?
  if (!(postId || comment || subscriber)) {
    res.status(400)
    throw new Error("Unauthorized!")
  }

  // Get post & user/author
  const post = await Post.findById(postId).exec()
  const author = await Subscriber.findById(subscriber, 'username').exec()

  // Check if post and user/author exist?
  if (post && author) {
    // create the comment
    const myComment = await Comment.create({ postId, subscriber, comment })
    // check if comment was created?
    if (myComment) {
      // return "Commented!"
      res.json({ message: "Commented!" })
    } else {
      res.status(400)
      throw new Error()
    }
  } else {
    res.status(400)
    throw new Error("Post & User doesn't exist!")
  }
})


/**
 * @desc    Delete comment
 * @route   DELETE /api/comments
 * @access  private
 */
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id).exec()
  
  if (comment) {
    await comment.remove()
  }
  res.json({ message: "Deleted!"})
})

export {
  getComments,
  getCommentById,
  createComment,
  deleteComment
}