const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

const helper = require('./test_helper')

describe('when database has some blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    // eslint-disable-next-line no-restricted-syntax
    for (const blog of helper.initialBlogs) {
      const blogObject = new Blog(blog)
      // eslint-disable-next-line no-await-in-loop
      await blogObject.save()
    }
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body.length).toBe(helper.initialBlogs.length)
  })

  test('blog has an id property', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })

  test('if blog has no likes the value defaults to 0', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[1].likes).toEqual(0)
  })

  describe('adding a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

      const blogTitles = blogsAtEnd.map(blog => blog.title)
      expect(blogTitles).toContain(
        'Canonical string reduction'
      )
    })

    test('fails with status code 400 if title is missing', async () => {
      const newBlog = {
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })

    test('fails with status code 400 if url is missing', async () => {
      const newBlog = {
        author: 'Robert C. Martin',
        title: 'First class tests',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })
  })

  describe('deleting a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      // eslint-disable-next-line prefer-destructuring
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(
        helper.initialBlogs.length - 1
      )

      const titles = blogsAtEnd.map(r => r.title)
      expect(titles).not.toContain(blogToDelete.title)
    })

    test('fails with status code 404 if blog does not exist', async () => {
      const nonExistentId = '5d7c4090220c3d92e7564e35'

      await api
        .delete(`/api/blogs/${nonExistentId}`)
        .expect(404)
    })
  })

  describe('updating a blog', () => {
    test('successfully updates a blog', async () => {
      const blogsAtStart = await helper.blogsInDb()
      // eslint-disable-next-line prefer-destructuring
      const blogToChange = blogsAtStart[1]

      blogToChange.likes += 1

      await api
        .put(`/api/blogs/${blogToChange.id}`)
        .expect(200)

      expect(blogToChange.likes).toBe(1)
    })

    test('fails with status code 400 if blog does not exist', async () => {
      const nonExixtentBlog = {
        _id: '5d7c4090220c3d92e7564e35',
        __v: 0
      }

      await api
        .put(`/api/blogs/${nonExixtentBlog.id}`)
        .expect(400)
    })
  })
})

describe('when database has no users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('creating a new user is successful', async () => {
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'superpw'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/users')

    expect(response.body.length).toBe(1)
    expect(response.body[0].username).toEqual(newUser.username)
  })

  test('fails with status code 400 if password is missing', async () => {
    const newUser = {
      username: 'dummy'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const response = await api.get('/api/users')

    expect(result.body.error).toContain('missing username or password')
    expect(response.body.length).toBe(0)
  })

  test('fails with status code 400 if username is missing', async () => {
    const newUser = {
      password: 'dummypw'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const response = await api.get('/api/users')

    expect(result.body.error).toContain('missing username or password')
    expect(response.body.length).toBe(0)
  })
})

describe('when database has one user', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({
      username: 'root',
      password: 'superpw'
    })
    await user.save()
  })

  test('fails with status code 400 if username already taken', async () => {
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'superpw'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/users')

    expect(result.body.error).toContain('`username` to be unique')
    expect(response.body.length).toBe(1)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
