const mongoose = require('mongoose');
const { Schema } = mongoose;

const slotSchema = new Schema({
  experience_id: { type: Schema.Types.ObjectId, ref: 'Experience', required: true },
  start_time: { type: Date, required: true },
  total_capacity: { type: Number, required: true },
  booked_count: { type: Number, default: 0 }
});

module.exports = mongoose.model('Slot', slotSchema);