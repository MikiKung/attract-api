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
  categoryId: {
    type: mongoose.Types.ObjectId,
    ref: 'category',
  },
})

module.export = mongoose.model('post', Posts)
