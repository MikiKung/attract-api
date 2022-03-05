const express = require('express')
const Category = require('../models/category')

const router = express.Router()

// get all
router.get('/', async (req, res) => {
  const categorys = await Category.find()
  res.send(categorys)
})

// get one
router.get('/:id', async function (req, res) {
  const id = req.params.id
  const category = await Category.findOne({
    _id: id,
  })
  res.send(category)
})

router.post('/', async function (req, res) {
  const body = req.body
  try {
    await Category.create(body)
    res.send(body)
  } catch (error) {
    console.log(error)
    res.send('post incomplete')
  }
})

router.delete('/:id', async function (req, res) {
  const id = req.params.id
  await Category.deleteOne({
    _id: id,
  })
  res.send('delete complete')
})

router.patch('/:id', async function (req, res) {
  const id = req.params.id
  const body = req.body
  try {
    await Category.updateOne(
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
