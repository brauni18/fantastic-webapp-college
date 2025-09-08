const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  type: {type: String, enum: ['text', 'image', 'video'], required: true},
  title: {type: String, trim: true},

  content: {type: String, default: '', trim: true},
  imageUrl: {type: String, default: ''},
  videoUrl: {type: String, default: ''},

  community: {type: String, default: '', trim: true},
  createdBy: {type: String, required: true},
  createdAt: {type: Date, default: Date.now},
  //likes should be an array of user IDs who liked the post
  likes: {type: [String], default: []},
  //comments should be an array of objects with user name and comment text
  comments: {type: [Object], default: []},
  shares: {type: Number, default: 0},
});

module.exports = mongoose.model('Post', postSchema);
