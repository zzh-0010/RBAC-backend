const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

//先写两个api进行测试

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  console.log('authPost body', request.token)

  if (request.token === undefined) {
    return response.status(401).json({ error: 'You need a token' })
  }

  const blog = new Blog({ ...body })

  try {
    await blog.save()
    response.status(201).json(blog)
  } catch (error) {
    console.log(error)
    response.status(400).end()
  }
})

module.exports = blogsRouter