const express = require('express');
const mongoose = require('mongoose'); // Import mongoose
const app = express();
const port = process.env.PORT || 5000;

app.use(express.static('public'))
app.use(express.json());

// MongoDB connection URI (replace with your actual URI)
const mongoURI = 'mongodb://localhost:27017/mydatabase';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

//Routes for React server 
// const bookRouter = require('./server/routes/books')
const authorRouter = require('./server/routes/authors')
const testRouter = require('./server/routes/tests')
// const seriesRouter = require('./server/routes/series')

app.use('/api/tests', testRouter) //Eventually rename bookRouter
app.use('/api/authors', authorRouter)
// app.use('/api/series', seriesRouter)

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));