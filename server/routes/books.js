const express = require('express')
const router = express.Router()
const Book = require('../models/book')

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
    const book = new Book({
        title: req.body.title,
        description: req.body.description,
        publishDate: req.body.publishDate,
        pageCount: req.body.pageCount,
        format: req.body.format,
        genres: req.body.genres,
        author: {
            id: req.body.authorId,
            firstName: req.body.authorFirstName,
            lastName: req.body.authorLastName
        },
        series: {
            id: req.body.seriesId,
            title: req.body.seriesTitle,
            volume: req.body.seriesVolume
        }
    });

    try {
        const newBook = await book.save();
        res.status(201).json(newBook); // Send the newly created book object as a response
    } catch (err) {
        console.error('Error saving book:', err); // Log the error for debugging
        res.status(500).json({ message: 'Failed to save book' }); // Send a 500 response with an error message
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
    try {
        // Find the book by ID and update it with the new data
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id, // The ID of the book to update
            {
                title: req.body.title,
                description: req.body.description,
                publishDate: req.body.publishDate,
                pageCount: req.body.pageCount,
                format: req.body.format,
                genres: req.body.genres,
                author: {
                    id: req.body.authorId,
                    firstName: req.body.authorFirstName,
                    lastName: req.body.authorLastName
                },
                series: {
                    id: req.body.seriesId,
                    title: req.body.seriesTitle,
                    volume: req.body.seriesVolume
                }
            },
            { new: true, runValidators: true } // Return the updated document and validate the data
        );

        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json(updatedBook); // Send the updated book object as a response
    } catch (err) {
        console.error('Error updating book:', err);
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