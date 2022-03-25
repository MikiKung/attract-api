const db = require('./db/mongo')
const express = require('express')
const app = express()
const port = 3001
const cors = require('cors')
const serverless = require('serverless-http')
db
// const menu = require('./controllers/menu.js')
const mark = require('./controller/mark.js')
const category = require('./controller/category.js')
const user = require('./controller/user.js')
const post = require('./controller/post.js')
const search = require('./controller/search')
const comment = require('./controller/comment')

app.use(
  cors({
    origin: '*',
  }),
)
app.get('/', (req, res) => {
  res.json({
    "hello":"hello"
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.use(express.json())
app.use('/mark', mark)
app.use('/category', category)
app.use('/user', user)
app.use('/post', post)
app.use('/search', search)
app.use("/comment", comment)

module.exports.handler = serverless(app)