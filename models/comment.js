const mongoose = reqire('mongoose')

const Comments = mongoose.model(
  'comment',
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
    CommentUserId: {
      // ------------------
    },
    CommentText: {
      type: String,
    },
  }),
)

module.export = Comments
