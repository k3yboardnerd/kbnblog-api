import mongoose from 'mongoose'

const messageSchema = mongoose.Schema({
  subscriber: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  }
}, { timestamps: true })

export const Message = mongoose.model('message', messageSchema)