const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const Joi = require('joi')

const router = express.Router()

const middleware = (req, res, next) => {
  const token = req.headers.authorization
  if (!token || token == 'Bearer null') {
    return res.status(200).send('no token')
  }
  const r = jwt.verify(token.split(' ')[1], 'shhh')
  req.decodedToken = r.id
  next()
}

router.post('/follow', middleware, async (req, res) => {
  const { error } = Joi.object({
    followingId: Joi.string().required(),
  }).validate(req.body)

  if (error) {
    res.send({ error })
  } else {
    await User.updateOne(
      { _id: req.decodedToken },
      { $push: { followingUser: req.body.followingId } },
    )
    await User.updateOne(
      { _id: req.body.followingId },
      { $push: { followerUser: req.decodedToken } },
    )
    res.send('Following success')
  }
})

router.delete('/unfollow/:id', middleware, async (req, res) => {
  const user = await User.findById(req.decodedToken)
  const followingUser = await User.findById(req.params.id)

  user.followingUser = user.followingUser.filter(e => e.toString() !== req.params.id)
  followingUser.followerUser = followingUser.followerUser.filter(e => e.toString() !== req.decodedToken)

  await user.save()
  await followingUser.save()

  res.send("Unfollow success")

})

router.get('/', async (req, res) => {
  const Users = await User.find().populate({
    path: 'postId',
    populate: {
      path: 'categoryId',
    },
  })
  res.send(Users)
})

router.post('/', async function (req, res) {
  const user = await User.findOne().where({ email: req.body.email })
  const body = req.body
  body.password = bcrypt.hashSync(req.body.password, 10)
  if (user != null) {
    res.send('email is used')
  } else {
    try {
      await User.create(body)
      res.send(body)
    } catch (error) {
      console.log(error)
      res.send('post incomplete')
    }
  }
})

router.delete('/:id', async function (req, res) {
  const id = req.params.id
  await User.deleteOne({
    _id: id,
  })
  res.send('delete complete')
})

router.patch('/me', middleware, async function (req, res) {
  const id = req.decodedToken
  const body = req.body
  try {
    await User.updateOne(
      {
        _id: id,
      },
      { $set: body },
    )
    res.send(body)
  } catch (error) {
    res.send('patch incomplete')
  }
})

//login
router.post('/login', async function (req, res) {
  const user = await User.findOne().where({ email: req.body.email })
  if (user == null) {
    res.send('no email in DB')
  } else {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign({ id: user._id }, 'shhh')
      res.send({ token, user })
    } else {
      res.send('invalid password')
    }
  }
})

router.get('/me', middleware, async (req, res) => {
  const user = await User.findById(req.decodedToken)
    .select('-password')
    .populate({
      path: 'postId',
      // sort
      options: {
        sort: { timePost: -1 },
      },
      populate: {
        path: 'categoryId',
      },
    })
  res.send(user)
})

router.get('/:id', async function (req, res) {
  const id = req.params.id
  const Users = await User.findOne({
    _id: id,
  })
    .populate('interestCategoryId')
    .populate('followerUser')
    .populate('followingUser')
    .populate({
      path: 'postId',
      // sort
      options: {
        sort: { timePost: -1 },
      },
      populate: [
        {
          path: 'categoryId',
        },
        {
          path: 'markId',
        },
      ],
    })
  // console.log(Users)
  res.send(Users)
})

module.exports = router
