const express = require('express')
const Post = require('../models/post')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const router = express.Router()

// get all
router.get('/', async (req, res) => {
  const posts = await Post.find().populate('categoryId')
  res.send(posts)
})

router.get('/feed', async (req, res) => {
  const authorization = req.headers.authorization
  if (authorization && authorization != 'Bearer null') {
    const token = authorization.split(' ')[1]
    if (!token) {
      return res.send('no token')
    }
    const decoded = jwt.verify(token, 'shhh')

    const user = await User.findById(decoded.id).lean()
    const followerUserIds = user.followingUser.map((e) => e.toString())

    const posts = await Post.find({
      ownUserId: {
        $in: [...followerUserIds, decoded.id],
      },
    })
      .populate('ownUserId')
      .populate('categoryId')
      .populate('markId')
      .populate({ path: 'commentId', populate: 'ownUserId' })
      .sort({ timePost: -1 })

    res.send(posts)
  } else {
    res.send('no token')
  }
})

router.get('/recommand', async (req, res) => {
  const posts = await Post.aggregate([
    {
      $addFields: {
        counts: {
          $size: '$markId',
        },
      },
    },
    {
      $sort: {
        counts: -1,
      },
    },
    {
      $limit: 10,
    },
    {
      $lookup: {
        from: 'users',
        localField: 'ownUserId',
        foreignField: '_id',
        as: 'ownUserId',
      },
    },
    {
      $unwind: {
        path: '$ownUserId',
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'categoryId',
      },
    },
    {
      $lookup: {
        from: 'marks',
        localField: 'markId',
        foreignField: '_id',
        as: 'markId',
      },
    },
    {
      $lookup: {
        from: 'comments',
        let: { p_id: '$_id' },
        pipeline: [
          {
            $match: { $expr: { $eq: ['$postId', '$$p_id'] } },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'ownUserId',
              foreignField: '_id',
              as: 'ownUserId',
            },
          },
        ],
        as: 'commentId',
      },
    },
  ])

  res.send(
    posts.map((e) => ({
      ...e,
      commentId: e.commentId.map((c) => ({ ...c, ownUserId: c.ownUserId[0] })),
    })),
  )
})

router.get('/search', async (req, res) => {
  const { q } = req.query
  const posts = await Post.aggregate([
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'categoryId',
      },
    },

    {
      $match: {
        categoryId: {
          $elemMatch: {
            name: new RegExp(q, 'gi'),
          },
        },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'ownUserId',
        foreignField: '_id',
        as: 'ownUserId',
      },
    },
    {
      $unwind: {
        path: '$ownUserId',
      },
    },
    {
      $lookup: {
        from: 'marks',
        localField: 'markId',
        foreignField: '_id',
        as: 'markId',
      },
    },
    {
      $lookup: {
        from: 'comments',
        let: { p_id: '$_id' },
        pipeline: [
          {
            $match: { $expr: { $eq: ['$postId', '$$p_id'] } },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'ownUserId',
              foreignField: '_id',
              as: 'ownUserId',
            },
          },
        ],
        as: 'commentId',
      },
    },
  ])
  res.send(
    posts.map((e) => ({
      ...e,
      commentId: e.commentId.map((c) => ({ ...c, ownUserId: c.ownUserId[0] })),
    })),
  )
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
      await User.updateOne(
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
