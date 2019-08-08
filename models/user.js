const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
  username: {
    type: String,
    minlength: 3,
    unique: true,
    required: true
  },
  name: String,
  passwordHash: String
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const user = returnedObject

    user.id = user._id.toString()
    delete user._id
    delete user.__v
    // the passwordHash should not be revealed
    delete user.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
