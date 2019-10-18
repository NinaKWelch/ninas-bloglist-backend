const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
  content: {
    type: String,
    minlength: 5,
    unique: true
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }
})

commentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const comment = returnedObject

    comment.id = comment._id.toString()
    delete comment._id
    delete comment.__v
  }
})

module.exports = mongoose.model('Comment', commentSchema)
