const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    image:{
      type: jpeg,
      required: false,  
      trim: true,
    },
    video: {
      type: String,
      required: false,
      trim: true
    },
    audio: {
      type: String,
      required: false,
      trim: true
    }    
  },
  createdAt: {
    type: Date,
    default: Date.now,
    location: {
      type: {
        type: String,
        enum: ['Point'], // GeoJSON type
        required: true
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: false,
    default: null // Optional, can be null if the post is not associated with a group
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
