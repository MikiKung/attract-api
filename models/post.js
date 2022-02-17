const mongoose = reqire('mongoose')

const Posts = mongoose.model(
  'post',
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
    ownUserId: {
      // -------------------
    },
    TimePost: {
      type: Date,
    },
    PostText: {
      type: String,
    },
    CommentId: {
      // ------------------
    },
  }),
)

module.export = Posts
