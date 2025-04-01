const express = require('express')
const router = express.Router()
const Test = require('../models/test')

// Get all test objects
router.get('/', async (req, res) => {
    try {
        const test = await Test.find({})
        res.json(test)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

// POST route for /api/tests
router.post('/', async (req, res) => {
    const test = new Test({
        title: req.body.title
    });

    try {
        const newTest = await test.save();
        res.status(201).json(newTest); // Send the newly created test object as a response
    } catch (err) {
        console.error('Error saving test:', err); // Log the error for debugging
        res.status(500).json({ message: 'Failed to save test' }); // Send a 500 response with an error message
    }
});

module.exports = router;