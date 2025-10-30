const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // <-- 1. ADD THIS IMPORT
const Experience = require('../models/Experience');
const Slot = require('../models/Slot');

// GET /experiences - (Your existing route)
router.get('/', async (req, res) => {
  // ... (your code)
});

// GET /experiences/:id - Return details and slot availability
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check for valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    const experience = await Experience.findById(id);

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    // Now find all slots for this experience
    const slots = await Slot.find({ experience_id: id, booked_count: { $lt: 10 } }); // Only find slots not full

    res.json({ experience, slots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching details' });
  }
});

module.exports = router;