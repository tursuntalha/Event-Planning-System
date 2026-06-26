const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  date: { type: Date, required: true },
  endDate: { type: Date },
  location: { type: String, required: true },
  type: { type: String, required: true },
  tags: { type: [String], default: [] },
  participants: [{ type: String }],
  rsvps: [{
    email: { type: String },
    status: { type: String, enum: ['accepted', 'declined', 'maybe'], default: 'accepted' }
  }],
  createdBy: { type: String, required: true },
  createdById: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  isActive: { type: Boolean, default: true },
  maxAttendees: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
