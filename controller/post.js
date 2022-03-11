const express = require('express')
const Post = require('../models/post')
const user = require('../models/user')

const router = express.Router()

// get all
router.get('/', async (req, res) => {
  const posts = await Post.find().populate('categoryId')
  res.send(posts)
})

// get one
router.get('/:id', async function (req, res) {
  const id = req.params.id
  const posts = await Post.findOne({
    _id: id,
  })
  res.send(posts)
})

router.post('/', async function (req, res) {
  const body = req.body
  try {
    await Post.create(body).then(async (e) => {
      await user.updateOne(
        { _id: e.ownUserId },
        {
          $push: {
            postId: e._id,
          },
        },
      )
      res.send(e)
    })
    // res.send(body)
  } catch (error) {
    console.log(error)
    res.send('post incomplete')
  }
})

router.delete('/:id', async function (req, res) {
  const id = req.params.id
  await Post.deleteOne({
    _id: id,
  })
  res.send('delete complete')
})

router.patch('/:id', async function (req, res) {
  const id = req.params.id
  const body = req.body
  try {
    await Post.updateOne(
      {
        _id: id,
      },
      { $set: body },
    )
    res.send('patch complete')
  } catch (error) {
    res.send('patch incomplete')
  }
})

module.exports = router
