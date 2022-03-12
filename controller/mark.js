const express = require('express')
const Mark = require('../models/mark')
const Post = require('../models/post')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const router = express.Router()

// get all
router.get('/', async (req, res) => {
  const marks = await Mark.find()
  res.send(marks)
})

router.get('/user', async (req, res) => {
  const authorization = req.headers.authorization
  if (authorization || authorization != 'Bearer null') {
    const token = authorization.split(' ')[1]
    if (!token) {
      return res.send('no token')
    }
    const decoded = jwt.verify(token, 'shhh')

    const marks = await Mark.find({ userId: decoded.id }).populate({
      path: 'postId',
      populate: [
        { path: 'ownUserId' },
        { path: 'markId' },
        { path: 'categoryId' },
      ],
    })

    res.send(marks)
  } else {
    res.send('no token')
  }
})

// get one
router.get('/:id', async function (req, res) {
  const id = req.params.id
  const marks = await Mark.findOne({
    _id: id,
  })
  res.send(marks)
})

router.post('/', async function (req, res) {
  const body = req.body
  try {
    const mark = await Mark.create(body)
    await Post.updateOne({ _id: body.postId }, { $push: { markId: mark._id } })
    await User.updateOne(
      { _id: body.userId },
      { $push: { markPostId: mark._id } },
    )
    res.send(body)
  } catch (error) {
    console.log(error)
    res.send('post incomplete')
  }
})

router.delete('/:id', async function (req, res) {
  const id = req.params.id
  const mark = await Mark.findById(id)
  const post = await Post.findById(mark.postId)
  const user = await User.findById(mark.userId)

  console.log(id);

  post.markId = post.markId.filter((e) => e.toString() !== mark._id.toString())
  user.markPostId = user.markPostId.filter(
    (e) => e.toString() !== mark._id.toString(),
  )
  await mark.delete()
  await post.save()
  await user.save()
  res.send('delete complete')
})

router.patch('/:id', async function (req, res) {
  const id = req.params.id
  const body = req.body
  try {
    await Mark.updateOne(
      {
        _id: id,
      },
      { $set: body },
    )
    res.send('patch complete')
  } catch (error) {
    console.log(error)
    res.send('patch incomplete')
  }
})

module.exports = router
