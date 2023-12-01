import User from '../../models/userModel.js'
import { Post } from '../../models/postModel.js'
import asyncHandler from 'express-async-handler'
import { Comment } from '../../models/commentModel.js'
import { Subscriber } from '../../models/subscriberModel.js'

/**
 * @desc    Get all posts
 * @route   GET /api/kbn/posts/
 * @access  private
 */
const getPosts = asyncHandler(async (req, res) => {
  const all = []

  // Check if the requesting user/stuff is logged in
  if (req.user._id) {
    // find the user by id
    const user = await User.findById(req.user._id, 'admin').exec()
    // check user exists?
    if (user) {
      // check if user is admin
      if (user.admin) {
        // find all posts
        const posts = await Post.find({}).sort({ createdAt: -1 })
        // check if are there any posts
        if (posts.length === 0) {
          res.status(400).json({ message: "There are no posts at the moment!" })
        }
        // loop and modify them all
        for (let i = 0; i < posts.length; i++) {
          // get the author
          const author = await User.findById(posts[i].user, 'name photo').exec()
          const comments = await Comment.find({ postId: posts[i]._id })
          // bundle them
          all.push({
            _id: posts[i]._id,
            title: posts[i].title,
            category: posts[i].category,
            views: posts[i].views,
            cover: posts[i].cover.toString(),
            comments: comments.length,
            date: posts[i].createdAt,
            author: {
              name: author.name,
              photo: author.photo.toString()
            }
          })
        }
        // return them
        res.status(200).json(all)
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
 * @desc    Create a new post
 * @route   POST /api/kbn/posts/
 * @access  private
 */
const createPost = asyncHandler(async (req, res) => {
  // extract the fields from the body
  const { user, title, category, body, cover } = req.body

  // check if all fields were filled
  if (!(title || category || body || cover)) {
    res.status(400)
    throw new Error("Please fill all fields")
  }

  // Check if the requesting user/stuff is logged in
  if (req.user._id) {
    // find the user by id
    const user = await User.findById(req.user._id, 'admin').exec()
    // check user exists?
    if (user) {
      // check if user is admin
      if (user.admin) {
        // create a new post
        const post = await Post.create({
          user: user._id,
          title,
          category,
          body,
          cover
        })
        // check if are the post was created
        if (post) {
          res.status(201).json({ message: "Post was published!" })
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

/**
 * @desc    Update post
 * @route   PUT /api/kbn/posts/:id
 * @access  private
 */
const updatePost = asyncHandler(async (req, res) => {
  const { title, category, body, cover } = req.body
  const post = await Post.findById(req.params.id).exec()
  const author = await User.findById(post.user, '_id admin').exec()
  if (post) {
    post.title = title || post.title
    post.category = category || post.category
    post.cover = cover || post.cover
    post.body = body || post.body

    const updatedPost = await post.save()

    res.status(200).json({
      _id: updatedPost._id,
      user: updatedPost.user,
      title: updatedPost.title,
      cover: updatedPost.cover.toString(),
      body: updatedPost.body,
      category: updatedPost.category
    })
  } else {
    res.status(400)
    throw new Error("Something bad happened")
  }
})

/**
 * @desc    Delete post
 * @route   DELETE /api/kbn/posts/:id
 * @access  private
 */
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).exec()

  if (post) {
    await Comment.deleteMany({postId: post._id})
    await post.remove()
    res.status(200).json({
      message: "Post deleted successfully!"
    })
  } else {
    res.status(400)
    throw new Error("Unathorized!")
  }
})

/**
 * @desc    Get post by id
 * @route   GET /api/kbn/posts/:id
 * @access  public
 */
const getPostById = asyncHandler(async (req, res) => {
  // const { id } = req.params
  const myPost = await Post.findById(req.params.id).exec()
  const author = await User.findById(myPost.user, 'name admin photo').exec()
  if (myPost) {
    res.status(200).json({
      _id: myPost._id,
      title: myPost.title,
      category: myPost.category,
      body: myPost.body,
      createdAt: myPost.createdAt,
      cover: myPost.cover.toString(),
      author: {
        _id: author._id,
        name: author.name,
        admin: author.admin,
        photo: author.photo.toString()
      }
    })
  } else {
    res.status(400)
    throw new Error("Something bad happened!")
  }

})

export {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  getPostById
}