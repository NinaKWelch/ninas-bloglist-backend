const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate(
    'user', {
      username: 1,
      name: 1
    }
  )
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    /* temporary solution for tests to pass
    if (process.env.TEST_MONGODB_URI) {
      const blog = new Blog(request.body)
      const savedBlog = await blog.save()
      response.status(201).json(savedBlog.toJSON())
    } */

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)

    const blog = new Blog(request.body)
    blog.user = user._id

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    /* temporary solution for tests to pass
    if (process.env.TEST_MONGODB_URI) {
      const blog = await Blog.findByIdAndRemove(request.params.id)

      if (!blog) {
        response.status(404).json({ error: 'blog does not exist' })
      }

      response.status(204).end()
    } */

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      response.status(404).json({ error: 'blog does not exist' })
    }

    if (user._id.toString() === blog.user.toString()) {
      await blog.remove()
      response.status(204).end()
    }
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const blog = request.body

  try {
    if (!blog) {
      response.status(400).json({ error: 'invalid request' })
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.status(200).json(updatedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter
