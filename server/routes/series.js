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
        author: {
            id: req.body.authorId,
            firstName: req.body.authorFirstName,
            lastName: req.body.authorLastName
        }
    }) 

    try {
        const newSeries = await series.save()
        res.status(201).json(newSeries) // Send the newly created series object as a response
    } catch (err) {
        console.error('Error saving series:', err) // Log the error for debugging
        res.status(500).json({ message: 'Failed to save series' }) // Send a 500 response with an error message
    }
})

// Get a single series by ID
router.get('/:id', async (req, res) => {
    try {
        const series = await Series.findById(req.params.id);
        if (!series) {
            return res.status(404).json({ message: 'Series not found' });
        }
        res.json(series);
    } catch (err) {
        console.error('Error fetching series:', err);
        res.status(500).json({ message: 'Failed to fetch series' });
    }
})

// Edit series object
router.get('/:id/edit', async (req, res) => {
    try {
        const series = await Series.findById(req.params.id);
        res.json(series)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Update series object
router.put('/:id', async (req, res) => {
    try {
        // Find the series by ID and update it with the new data
        const updatedSeries = await Series.findByIdAndUpdate(
            req.params.id, // The ID of the series to update
            {
                title: req.body.title,
                author: {
                    id: req.body.authorId,
                    firstName: req.body.authorFirstName,
                    lastName: req.body.authorLastName
                }
            },
            { new: true, runValidators: true } // Return the updated document and validate the data
        )

        if (!updatedSeries) {
            return res.status(404).json({ message: 'Series not found' })
        }

        res.status(200).json(updatedSeries); // Send the updated series object as a response
    } catch (err) {
        console.error('Error updating series:', err)
        res.status(500).json({ message: 'Failed to update series' })
    }
})

// DELETE route for /api/authors/:id
router.delete('/:id', async (req, res) => {
    try {
        const series = await Series.findByIdAndDelete(req.params.id);
        if (!series) {
            return res.status(404).json({ message: 'Series not found' });
        }
        res.status(200).json({ message: 'Series deleted successfully', id: req.params.id });
    } catch (err) {
        console.error('Error deleting series:', err);
        res.status(500).json({ message: 'Failed to delete series' });
    }
});

module.exports = router