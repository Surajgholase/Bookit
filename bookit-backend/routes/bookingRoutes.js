const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Slot = require('../models/Slot');

// POST /bookings
router.post('/', async (req, res) => {
  const { experience_id, slot_id, user_name, user_email, promo_code, final_price } = req.body;

  // --- 1. Basic Validation ---
  if (!experience_id || !slot_id || !user_name || !user_email || !final_price) {
    return res.status(400).json({ message: 'Missing required booking information.' });
  }

  // --- 2. Start a Database Session (for transaction) ---
  // This ensures that both operations (updating slot & creating booking)
  // either both succeed or both fail.
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // --- 3. Find and Atomically Update the Slot ---
    // We find the slot *and* check if it has capacity in one operation.
    // We use $inc to increment 'booked_count' by 1.
    // This is the key to preventing double-booking.
    
    const slot = await Slot.findOneAndUpdate(
      { 
        _id: slot_id, 
        experience_id: experience_id,
        // Check if booked_count is LESS THAN total_capacity
        $expr: { $lt: [ "$booked_count", "$total_capacity" ] } 
      },
      { 
        $inc: { booked_count: 1 } // Increment the booked count
      },
      { 
        new: true, // Return the *updated* document
        session: session // Run this operation in our transaction
      }
    );

    // --- 4. Check if the slot update was successful ---
    if (!slot) {
      // If 'slot' is null, it means our findOneAndUpdate query failed.
      // This happens if the slot doesn't exist OR if it's already full.
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ message: 'This slot is no longer available or is full.' });
    }

    // --- 5. If slot update was successful, create the booking ---
    const newBooking = new Booking({
      experience_id,
      slot_id,
      user_name,
      user_email,
      promo_code,
      final_price
    });

    await newBooking.save({ session: session });

    // --- 6. Commit the transaction ---
    await session.commitTransaction();
    session.endSession();
    
    // --- 7. Send success response ---
    res.status(201).json({ 
      message: 'Booking successful!', 
      booking: newBooking 
    });

  } catch (err) {
    // If any error occurs, abort the entire transaction
    await session.abortTransaction();
    session.endSession();
    console.error('Booking failed:', err);
    res.status(500).json({ message: 'Booking failed. Please try again.' });
  }
});

module.exports = router;