const express = require('express');
const router = express.Router();

// A simple in-memory list of valid promo codes
const VALID_PROMOS = {
  "SAVE10": { type: "percent", value: 10 },
  "FLAT100": { type: "fixed", value: 100 }
};

// POST /promo/validate
router.post('/validate', (req, res) => {
  const { promo_code } = req.body;

  if (!promo_code) {
    return res.status(400).json({ valid: false, message: 'Promo code is required.' });
  }
  
  const promo = VALID_PROMOS[promo_code.toUpperCase()];

  if (promo) {
    // Found a valid code
    res.json({
      valid: true,
      code: promo_code.toUpperCase(),
      discount: promo
    });
  } else {
    // Code is not valid
    res.status(404).json({ valid: false, message: 'Invalid promo code.' });
  }
});

module.exports = router;