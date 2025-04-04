const mongoose = require('mongoose')

const seriesAuthorSchema = new mongoose.Schema({ 
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    firstName: String,
    lastName: String
})

const seriesSchema = new mongoose.Schema({
  title: {
      type: String,
      required: true
  },
  author: seriesAuthorSchema,
})

module.exports = mongoose.model('Series', seriesSchema)