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

module.exports = router;