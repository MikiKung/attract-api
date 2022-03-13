const User = require('../models/user')
const Category = require('../models/category')
const Post = require('../models/post')
const jwt = require('jsonwebtoken')

const router = require('express').Router()

router.get('/', async (req, res) => {
  const { type, q } = req.query
  const authorization = req.headers.authorization
  let uid
  if (authorization) {
    const token = authorization.split(' ')[1]
    const decoded = jwt.verify(token, 'shhh')
    uid = decoded.id
  }

  let searchResult

  if (type == 'user') {
    searchResult = await User.aggregate([
      {
        $addFields: {
          fullname: {
            $concat: ['$firstname', '$surename'],
          },
        },
      },
      {
        $match: {
          fullname: {
            $regex: new RegExp(q, 'gi'),
          },
        },
      },
    ])
  } else if (type == 'text') {
    searchResult = await Post.aggregate([
      {
        $match: {
          postText: {
            $regex: new RegExp(q, 'gi'),
          },
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
          from: 'comments',
          let: {
            comment: '$commentId',
          },
          pipeline: [
            {
              $match: { $expr: { $eq: ['$_id', '$$comment'] } },
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
          as:'commentId'
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
    ])
  } else {
    searchResult = await Category.aggregate([
      {
        $match: {
          name: {
            $regex: new RegExp(q, 'gi'),
          },
        },
      },
    ])
  }

  if (uid) {
    const user = await User.findById(uid)
    if (!user.historySearch.some((e) => e == q)) {
      user.historySearch.push(q)
      await user.save()
    }
  }

  res.send(searchResult)
})

module.exports = router
