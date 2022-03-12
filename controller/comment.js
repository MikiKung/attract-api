const router = require('express').Router()
const Comment = require('../models/comment')
const Post = require('../models/post')

router.get('/', async (req, res) => {
  const comments = await Comment.find().populate('ownUserId').populate('postId')
  res.send(comments)
})

router.post('/', async (req, res) => {
  const comment = await Comment.create(req.body)
  await Post.updateOne(
    { _id: req.body.postId },
    { $push: { commentId: comment._id } },
  )
  res.send('Comment create success')
})

router.patch('/:id', async (req, res) => {
  await Comment.updateOne({ _id: req.params.id }, { $set: req.body })
  res.send('Comment update success')
})

router.delete('/:id', async (req, res) => {
  const comment = await Comment.findById(req.params.id)
  const post = await Post.findById(comment.postId)
  post.commentId = post.commentId.filter((e) => e.toString() !== req.params.id)
  await comment.delete()
  await post.save()
  res.send('Comment delete success')
})

module.exports = router
