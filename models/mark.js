const mongoose = require('mongoose')

const mark = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "user"
  },
  postId: {
    type: mongoose.Types.ObjectId,
    ref: "post"
  },
})

module.exports = mongoose.model('mark', mark)
