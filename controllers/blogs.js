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
blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.status(200).json(blog)
})
blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findByIdAndUpdate(request.params.id, request.body)
  response.status(200).json(blog)
})

module.exports = {
  blogsRouter
}