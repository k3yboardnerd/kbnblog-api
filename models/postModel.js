import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  cover: {
    type: Buffer,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  views: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

export const Post = mongoose.model("post", postSchema)