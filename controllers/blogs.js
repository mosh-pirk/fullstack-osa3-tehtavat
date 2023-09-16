const { Blog } = require('../models/blogs')
const { verify } = require('jsonwebtoken')
const { User } = require('../models/user')
const blogsRouter = require('express').Router()

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.status(200).json(blogs)
})

blogsRouter.post('', async (request, response) => {
  let blogData = request.body

  /*  const decodedToken = verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
*/
  if (blogData.likes === undefined) {
    blogData.likes = 0
  }

  const users = await User.find({})
  const user = users[0]
  const blog = new Blog({ ...request.body, user: user._id })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(blog._id)
  await user.save()
  response.status(201).json(savedBlog)
})
blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user')
  response.status(200).json(blog)
})
blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findByIdAndUpdate(request.params.id, request.body)
  response.status(200).json(blog)
})

module.exports = {
  blogsRouter
}