const mongoose = reqire('mongoose')

const Category = mongoose.model(
  'category',
  new mongoose.Schema({
    ID: {
      type: String,
    },
    name: {
      type: String,
    },
  }),
)

module.export = Category
