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
  interestCategoryId: {
    type: mongoose.types.ObjectId,
    ref: 'category',
  },
  postId: {
    type: mongoose.types.ObjectId,
    ref: 'post ',
  },
  followingUser: {
    type: mongoose.types.ObjectId,
    ref: 'post ',
  },
  followerUser: {
    type: mongoose.types.ObjectId,
    ref: 'post ',
  },
  markPostId: {
    type: String,
  },
  notificationId: {
    type: String,
  },
  historySearch: {
    type: String,
  },
})

module.export = mongoose.model('user', User)
