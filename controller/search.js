const User = require('../models/user')
const Category = require('../models/category')
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
