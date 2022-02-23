const mongoose = require('mongoose')

const Notifications = new mongoose.Schema({
  Img: {
    type: String,
  },
  ownUserId: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
  },
  otherUserId: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
  },
  textNoti: {
    type: String,
  },
  typeNoti: {
    type: String,
  },
})

module.export = mongoose.model('notification', Notifications)
