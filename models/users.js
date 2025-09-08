const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String }, // URL to profile picture
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  bio: { type: String, maxlength: 300 },
  createdAt: { type: Date, default: Date.now },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  // isAdmin:  { type: Boolean, default: false },
  pishpunLatitude: { type: Number },
  pishpunLongitude: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);