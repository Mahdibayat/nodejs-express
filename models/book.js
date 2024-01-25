const mongoose = require('mongoose');
const path = require('path');

const {ObjectId} = mongoose.Types

const coverImageUrl = 'uploads/bookCovers';

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  publishDate: {
    type: Date,
    required: true
  },
  pageCount: {
    type: Number,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  author: {
    type: ObjectId,
    required: true,
    ref: 'Author'
  },
  coverImageName: {
    type: String,
    require: true
  }
})

bookSchema.virtual('coverImagePath').get(function () {
  if (!!this.coverImageName) {
    return path.join('/', coverImageUrl, this.coverImageName)
  }
})

module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath = coverImageUrl
