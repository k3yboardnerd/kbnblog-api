import asyncHandler from 'express-async-handler'
import { Donation } from '../models/donationModel.js'
import { Subscriber } from '../models/subscriberModel.js'

/**
 * @desc    Creates donation
 * @route   POST api/donations/
 * @access  public
 */
const donate = asyncHandler(async (req, res) => {
  // extract all fields from the request body
  const {subscriberId, amount} = req.body

  // check if amount is > $1
  if (amount >= 1) {
    // create a new donation
    const donation = await Donation.create({subscriberId, amount})
    // increase/add the donation total of the donating subscriber with the amount donated
    const subscriber = await Subscriber.findByIdAndUpdate(subscriberId, {$inc: {donationTotal: amount}},{new: true})
    if (!subscriber) {
      res.status(400)
      throw new Error('Please subscriber to make the donation process faster.')
    }
    res.status(201).json({message: `Thanks for $${amount} donation @${subscriber.username}!`})
  } else {
    res.status(400)
    throw new Error('A minimum of $1 or upwards is required for a successful donation.')
  }
})

export {
  donate
}