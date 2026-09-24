const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skill: {
      type: String,
      required: [true, 'Skill is required for the session'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Session date is required (YYYY-MM-DD)'],
    },
    time: {
      type: String,
      required: [true, 'Session time is required (e.g. 17:00 or 5:00 PM)'],
    },
    duration: {
      type: Number,
      default: 60, // in minutes
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'completed', 'cancelled'],
      default: 'pending',
    },
    meetingLink: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
      maxlength: 500,
    },
    reviewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Session', SessionSchema);
