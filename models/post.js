const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'image', 'video'],
    required: true
  },
  title: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    trim: true
  },
  image: {
    filename: String,
    mimetype: String,
    path: String // Where the file is stored on your server
  },
  video: {
    filename: String,
    mimetype: String,
    path: String
  },
  audio: {
    filename: String,
    mimetype: String,
    path: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
