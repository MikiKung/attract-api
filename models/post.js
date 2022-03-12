const mongoose = require('mongoose')

const Posts = new mongoose.Schema({
  img: {
    type: String,
  },
  ownUserId: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
  },
  timePost: {
    type: Date,
  },
  postText: {
    type: String,
  },
  categoryId: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'category',
    },
  ],
  markId: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'mark',
    },
  ],
  commentId: [
    {
      type: mongoose.Types.ObjectId,
      ref: "comment"
    }
  ]
})

module.exports = mongoose.model('post', Posts)
