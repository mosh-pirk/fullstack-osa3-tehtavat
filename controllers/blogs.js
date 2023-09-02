const { Blog } = require('../models/blogs')
const blogsRouter = require('express').Router()

blogsRouter.get('', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('', (request, response) => {
  console.log('-----xxoxx----', request.body)
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})


module.exports = {
  blogsRouter
}