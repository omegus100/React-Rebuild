const mongoose = require('mongoose')

const bookAuthorSchema = new mongoose.Schema({ 
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    firstName: String,
    lastName: String
})

const bookSeriesSchema = new mongoose.Schema({ 
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Series'
    },
    title: String,
    volume: Number 
})

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    publishDate: Date, 
    pageCount: Number,
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    author: bookAuthorSchema,
    series: bookSeriesSchema,
    format: [String],
    genres: [String]
})

module.exports = mongoose.model('Book', bookSchema)