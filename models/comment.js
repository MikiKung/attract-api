const mongoose = require('mongoose')

const Comments = new mongoose.Schema({
  ownUserId: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
  },
  commentText: {
    type: String,
  },
  postId: {
    type: mongoose.Types.ObjectId,
    ref: 'post',
  },
})

module.exports = mongoose.model('comment', Comments)
