const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
  experience_id: { type: Schema.Types.ObjectId, ref: 'Experience', required: true },
  slot_id: { type: Schema.Types.ObjectId, ref: 'Slot', required: true },
  user_name: { type: String, required: true },
  user_email: { type: String, required: true },
  promo_code: { type: String },
  final_price: { type: Number, required: true }
});

module.exports = mongoose.model('Booking', bookingSchema);