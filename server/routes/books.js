const express = require('express')
const router = express.Router()
const Book = require('../models/book')

// Get all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find({})
        res.json(books)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

// Get a single book by ID
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').exec();
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new book
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        description: req.body.description,
        publishDate: req.body.publishDate,
        pageCount: req.body.pageCount,
        coverImage: req.body.coverImage,
        coverImageType: req.body.coverImageType,
        author: req.body.author,
        bookSeries: req.body.bookSeries,
        bookType: req.body.bookType,
        bookGenre: req.body.bookGenre
    });

    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Export the router
module.exports = router;