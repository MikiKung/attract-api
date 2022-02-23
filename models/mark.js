const mongoose = require('mongoose')

const mark = new mongoose.Schema({
  userId: {
    type: String,
  },
  postId: {
    type: String,
  },
})

module.exports = mongoose.model('mark', mark)
