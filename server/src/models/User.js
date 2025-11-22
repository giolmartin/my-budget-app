const mongoose = require('mongoose');

//Defining data schema for Users.

//Demo User
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Default Currency for the User, SEK
    defaultCurrency: {
      type: String,
      default: 'SEK',
    },

    //Base salary to use
    baseSalary: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  //timestamps add createdAt and updatedAt automatically
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
