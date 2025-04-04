const express = require('express')
const router = express.Router()
const Author = require('../models/author')

// Get all authors
router.get('/', async (req, res) => {
    try {
        const authors = await Author.find({})
        res.json(authors)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// POST route for /api/authors
router.post('/', async (req, res) => {
    const author = new Author({
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })

    try {
        const newAuthor = await author.save();
        res.status(201).json(newAuthor)
    } catch (err) {
        console.error('Error saving author:', err)
        res.status(500).json({ message: 'Failed to save author' })
    }
})

// Get a single author by ID
router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }
        res.json(author);
    } catch (err) {
        console.error('Error fetching author:', err);
        res.status(500).json({ message: 'Failed to fetch author' });
    }
})

// Edit author object
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        res.json(author)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
    

// Update author object
router.put('/:id', async (req, res) => {
    try {
        // Find the author by ID and update it with the new data
        const updatedAuthor = await Author.findByIdAndUpdate(
            req.params.id, // The ID of the author to update
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName
            },
            { new: true, runValidators: true } // Return the updated document and validate the data
        )

        if (!updatedAuthor) {
            return res.status(404).json({ message: 'Author not found' })
        }

        res.status(200).json(updatedAuthor); // Send the updated author object as a response
    } catch (err) {
        console.error('Error updating author:', err)
        res.status(500).json({ message: 'Failed to update author' })
    }
})

// DELETE route for /api/authors/:id
router.delete('/:id', async (req, res) => {
    try {
        const author = await Author.findByIdAndDelete(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }
        res.status(200).json({ message: 'Author deleted successfully', id: req.params.id });
    } catch (err) {
        console.error('Error deleting author:', err);
        res.status(500).json({ message: 'Failed to delete author' });
    }
});

module.exports = router;