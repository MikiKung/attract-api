const mongoose = require('mongoose')

const User = new mongoose.Schema({
  img: {
    type: String,
  },
  firstname: {
    type: String,
  },
  surname: {
    type: String,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  bio: {
    type: String,
  },
  gender: {
    type: String,
  },
  birthDate: {
    type: Date,
  },
  interestCategoryId: [{
    type: mongoose.Types.ObjectId,
    ref: 'category',
  }],
  postId: [{
    type: mongoose.Types.ObjectId,
    ref: 'post ',
  }],
  followingUser: [{
    type: mongoose.Types.ObjectId,
    ref: 'user ',
  }],
  followerUser: [{
    type: mongoose.Types.ObjectId,
    ref: 'user',
  }],
  markPostId: [{
    type: String,
  }],
  notificationId: [{
    type: String,
  }],
  historySearch: [{
    type: String,
  }],
})

module.exports = mongoose.model('user', User)
