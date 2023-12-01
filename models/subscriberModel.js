import mongoose from "mongoose"

const subscriberSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  views: [
    {
      postId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Post'
      },
      viewedOn: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  donationTotal: {
    type: Number,
    default: 0
  }
})

export const Subscriber = mongoose.model('subscriber', subscriberSchema)