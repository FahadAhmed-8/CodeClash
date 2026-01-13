const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  // ADD THESE NEW FIELDS BELOW
  bio: { type: String, default: "" },
  github: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  location: { type: String, default: "" },
  profilePic: { type: String, default: "" } 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);