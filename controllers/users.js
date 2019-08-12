const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate(
    'blogs', {
      title: 1,
      author: 1,
      url: 1
    }
  )
  response.json(users.map(user => user.toJSON()))
})

// eslint-disable-next-line consistent-return
usersRouter.post('/', async (request, response, next) => {
  // eslint-disable-next-line prefer-destructuring
  const body = request.body

  if (!body.username || !body.password) {
    return response.status(400).json({
      error: 'missing username or password'
    })
  }

  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter
