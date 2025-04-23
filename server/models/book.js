const mongoose = require('mongoose')

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
    author: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
        firstName: String,
        lastName: String
    },
    series: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Series'},
        title: {type: String},
        volume:{ type: Number} 
    },
    format: [String],
    genres: [String],
    coverImage: Buffer,
    coverImageType: String,
    coverImagePath: String,
    publisher: String,
    isbn: Number,
    readingStatus: String
})

module.exports = mongoose.model('Book', bookSchema)