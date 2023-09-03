const { Blog } = require('../models/blogs')
const blogsRouter = require('express').Router()

blogsRouter.get('', async (request, response) => {
  const blogs = await Blog.find({})
  response.status(200).json(blogs)
})

blogsRouter.post('', async (request, response) => {
  let blogData = request.body
  if (blogData.likes === undefined) {
    blogData.likes = 0
  }
  const blog = new Blog(request.body)
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

module.exports = {
  blogsRouter
}