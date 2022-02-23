const mongoose = require('mongoose')

const Comments = new mongoose.Schema({
  ownUserId: {
    type: String,
  },
  commentUserId: {
    type: String,
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
