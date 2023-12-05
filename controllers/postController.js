import asyncHandler from "express-async-handler"
import { Post } from "../models/postModel.js"
import User from "../models/userModel.js"

/**
 * @desc    Get all posts
 * @route   GET /api/posts
 * @access  public
 */
const getAllPosts = asyncHandler(async (req, res) => {
  let all = []
  const Posts = await Post.find({}).sort({ createdAt: -1 })
  // const author = await User.findById(Posts.user)

  for (let i = 0; i < Posts.length; i++) {
    const author = await User.findById(Posts[i].user, 'name admin photo').exec()
    all.push({
      _id: Posts[i]._id,
      title: Posts[i].title,
      category: Posts[i].category,
      createdAt: Posts[i].createdAt,
      cover: Posts[i].cover.toString(),
      author: {
        _id: author._id,
        name: author.name,
        admin: author.admin,
        photo: author.photo.toString()
      }
    })
  }

  res.status(200).json(all)
})

/**
 * @desc    Get post by id
 * @route   GET /api/posts/:id/:subId
 * @access  public
 */
const getPostById = asyncHandler(async (req, res, next) => {
  // const { id } = req.params
  console.log(req.body)
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
  next()
})

/**
 * @desc    Create new post
 * @route   POST /api/posts
 * @access  private
 */
const createNewPost = asyncHandler(async (req, res) => {
  const { user, title, category, body, cover } = req.body

  const userExists = await User.findById(user)

  

  if (userExists.admin === true) {
    const post = await Post.create({
      user,
      title,
      category,
      body,
      cover
    })
    res.status(201).json({message: "Post was created"})
  } else {
    res.status(400)
    throw new Error("User is not authorized to post!")
  }
})

/**
 * @desc    Update post
 * @route   PUT /api/posts/:id
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
 * @route   DELETE /api/posts/:id
 * @access  private
 */
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).exec()

  if (post) {
    await post.remove()
    res.status(200).json({
      _id: req.params.id
    })
  } else {
    res.status(400)
    throw new Error("Unathorized!")
  }
})

export { createNewPost, getAllPosts, getPostById, updatePost, deletePost }