const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const router = express.Router()

router.get('/', async (req, res) => {
  const Users = await User.find()
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

router.patch('/:id', async function (req, res) {
  const id = req.params.id
  const body = req.body
  try {
    await User.updateOne(
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

const middleware = (req, res, next) => {
  const token = req.headers.authorization
  if (!token || token == 'Bearer null') {
    return res.sendStatus(200)
  }
  const r = jwt.verify(token.split(' ')[1], 'shhh')
  req.decodedToken = r.id
  // console.log(r)
  next()
}

router.get('/me', middleware, async (req, res) => {
  const user = await User.findById(req.decodedToken).select('-password')
  res.send(user)
})

router.get('/:id', async function (req, res) {
  const id = req.params.id
  const Users = await User.findOne({
    _id: id,
  })
  res.send(Users)
})

module.exports = router
