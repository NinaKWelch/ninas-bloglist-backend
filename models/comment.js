const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
  content: {
    type: String,
    minlength: 2
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }
})

commentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const blog = returnedObject

    delete blog.__v
  }
})

module.exports = mongoose.model('Comment', commentSchema)
