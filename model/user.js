const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have name'],
    trim: true,
  },
  mobileNumber: {
    type: Number,
    required: [true, 'Please Provide us a valid Mobile Number'],
    unique: true,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;