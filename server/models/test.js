const mongoose = require('mongoose')
const book = require('./book')

const bookAuthorSchema = new mongoose.Schema({ 
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    firstName: String,
    lastName: String
})

// const bookSeriesSchema = new mongoose.Schema({ 
//     series: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Series'
//     },
//     title: String,
//     volume: Number 
// })

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
    author: bookAuthorSchema,
    format: [String],
    genres: [String]
})

module.exports = mongoose.model('Test', testSchema)