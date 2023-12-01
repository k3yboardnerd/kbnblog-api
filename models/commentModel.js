import mongoose from "mongoose"

const commentSchema = mongoose.Schema({
  subscriber: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Subscriber'
  },
  postId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Post'
  },
  comment: {
    type: String,
    required: true
  }
}, { timestamps: true })

export const Comment = mongoose.model('comment', commentSchema)