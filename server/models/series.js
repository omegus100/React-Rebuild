const mongoose = require('mongoose')
const Author = require('./author')

const seriesSchema = new mongoose.Schema({
  title: {
      type: String,
      required: true
  }, 
  author: {   
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'Author'
    }
})

module.exports = mongoose.model('Series', seriesSchema)