const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = require('../models/multer')

// Get all book objects
router.get('/', async (req, res) => {
    try {
        const book = await Book.find({})
        res.json(book)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

// POST route for /api/books
router.post('/', async (req, res) => {
    console.log('Request Body:', req.body)
    const { title, description, publishDate, pageCount, format, genres, authorId, seriesId, seriesTitle, seriesVolume, coverImagePath  } = req.body;

    const book = new Book({
        title,
        description,
        publishDate,
        pageCount,
        format,
        genres,
        author: { id: authorId },
        series: { id: seriesId, title: seriesTitle, volume: seriesVolume },
        coverImagePath 
    });

    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ message: 'Failed to create book' });
    }
});

// Get a single book by ID
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (err) {
        console.error('Error fetching book:', err);
        res.status(500).json({ message: 'Failed to fetch book' });
    }
})

// Edit book objects
router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        res.json(book)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Update book object
router.put('/:id', async (req, res) => {
    console.log('Request Body:', req.body)
    const { title, description, publishDate, pageCount, format, genres, authorId, seriesId, seriesTitle, seriesVolume, coverImagePath } = req.body;

    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Update the book fields
        book.title = title;
        book.description = description;
        book.publishDate = publishDate;
        book.pageCount = pageCount;
        book.format = format;
        book.genres = genres;
        book.author = { id: authorId };
        book.series = { id: seriesId, title: seriesTitle, volume: seriesVolume };
        book.coverImagePath = coverImagePath

        const updatedBook = await book.save();
        res.status(200).json(updatedBook);
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ message: 'Failed to update book' });
    }
})

// DELETE route for /api/books/:id
router.delete('/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully', id: req.params.id });
    } catch (err) {
        console.error('Error deleting book:', err);
        res.status(500).json({ message: 'Failed to delete book' });
    }
});
   
module.exports = router