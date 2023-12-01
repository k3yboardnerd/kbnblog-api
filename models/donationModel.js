import mongoose from "mongoose";

const donationSchema = mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  subscriberId: {
    type: mongoose.Types.ObjectId,
    ref: 'Subscriber',
    required: true
  }
}, {timestamps: true})

export const Donation = mongoose.model('donation', donationSchema)