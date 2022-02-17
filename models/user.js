const mongoose = reqire('mongoose')

const User = mongoose.model(
  'user',
  new mongoose.Schema({
    ID: {
      type: String,
    },
    img: {
      type: String,
    },
    Firstname: {
      type: String,
    },
    Surname: {
      type: String,
    },
    Username: {
      type: String,
    },
    Email: {
      type: String,
    },
    Password: {
      type: String,
    },
    bio: {
      type: String,
    },
    gender: {
      type: String,
    },
    BirthDate: {
      type: Date,
    },
    InterestCategoryId: {
      type: mongoose.types.ObjectId,
      ref: 'category',
    },
    PostId: {
        type: mongoose.types.ObjectId,
        ref: 'post ',
    },
    FollowingUser: {
      type: String,
    },
    FollowerUser: {
      type: String,
    },
    MarkPostId: {
      type: String,
    },
    location: {
      type: String,
    },
    NotificationId: {
      type: String,
    },
    HistorySearch: {
      type: String,
    },
  }),
)

module.export = User
