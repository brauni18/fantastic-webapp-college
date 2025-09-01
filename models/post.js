const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  type: {type: String, enum: ['text', 'image', 'video'], required: true},
  title: {type: String, trim: true},

  text: {type: String, default: '', trim: true},
  image: {type: String, default: '', trim: true},
  video: {type: String, default: '', trim: true},

  community: {type: String, default: '', trim: true},
  createdBy: {type: String, required: true},
  createdAt: {type: Date, default: Date.now},

  likes: {type: Number, default: 0},
  dislikes: {type: Number, default: 0},
  comments: {type: Number, default: 0},
  shares: {type: Number, default: 0},
});

module.exports = mongoose.model('Post', postSchema);

