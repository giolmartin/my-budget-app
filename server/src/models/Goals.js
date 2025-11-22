const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    //User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    //Name of the goal
    name: {
      type: String,
      required: true,
      trim: true,
    },

    //Optional Type (fixed, investing, savings, emergency, variable)
    type: {
      type: String,
      default: 'variable',
      trim: true,
    },

    //Importance weight (used when distribuiting the leftover money)
    importance: {
      type: Number,
      default: 1,
      min: 0,
    },

    //Min amount that should go into each per period.
    minimumPerPeriod: {
      type: Number,
      default: 0,
      min: 0,
    },

    //Optional Maximum
    maximumPerPeriod: {
      type: Number,
      default: null,
    },

    //Optional long term target
    target: {
      type: Number,
      default: null,
    },

    //Soft delete
    isActive: {
      type: Boolean,
      default: true,
    },
    //Sorting in UI
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
