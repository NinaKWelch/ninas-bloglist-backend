const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  // eslint-disable-next-line no-restricted-syntax
  for (const blog of helper.initialBlogs) {
    const blogObject = new Blog(blog)
    // eslint-disable-next-line no-await-in-loop
    await blogObject.save()
  }
})

describe('blog list', () => {
  test('blogs are returned as json and there are 2 blogs', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(helper.initialBlogs.length)
  })

  test('the unique identification of a blog is named id', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })

  afterAll(() => {
    mongoose.connection.close()
  })
})
