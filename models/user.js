const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String
})

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