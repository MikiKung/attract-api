const mongoose = reqire('mongoose')

const Notifications = mongoose.model(
  'notification',
  new mongoose.Schema({
    ID: {
      type: String,
    },
    Img: {
      type: String,
    },
    ownUserId: {
      // -------------------
    },
    OtherUserId: {
      // -------------------
    },
    Text: {
      type: String,
    },
    type: {
      type: String,
    },
  }),
)

module.export = Notifications;
