const express = require('express')
const router = express.Router()
const Series = require('../models/series')

// Get all series objects
router.get('/', async (req, res) => {
    try {
        const series = await Series.find({})
        res.json(series)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Create Series Route
router.post('/', async (req, res) => {
    const series = new Series({
        title: req.body.title,
        author: req.body.author
    }) 

    try {
        const newSeries = await series.save()
        res.status(201).json(newSeries) // Send the newly created series object as a response
    } catch (err) {
        console.error('Error saving series:', err) // Log the error for debugging
        res.status(500).json({ message: 'Failed to save series' }) // Send a 500 response with an error message
    }
})

module.exports = router