const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(express.static('public'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// MongoDB connection URI (replace with your actual URI)
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase'; // Fallback to local MongoDB

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err))

// Routes
const bookRouter = require('../server/routes/books')
const authorRouter = require('../server/routes/authors')
const seriesRouter = require('../server/routes/series')

app.use('/api/books', bookRouter)
app.use('/api/authors', authorRouter)
app.use('/api/series', seriesRouter)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Serve React app
app.use(express.static(path.join(__dirname, '../client/build')))
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'))
})

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`))