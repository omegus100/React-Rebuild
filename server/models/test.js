const mongoose = require('mongoose')

const bookFormats = ['Paperback','Hardback', 'eBook', 'Audiobook']
const genres = ["Biography", "Classics", "Fantasy", "Historical Fiction", "Horror", "Mystery", "Non-Fiction", "Romance", "Science Fiction", "Thriller", "Young Adult"]

const testSchema = new mongoose.Schema({
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
    format: [String],
    genres: [String]
})

module.exports = mongoose.model('Test', testSchema)