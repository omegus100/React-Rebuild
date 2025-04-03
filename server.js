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
const booksRouter = require('./server/routes/books')
const testRouter = require('./server/routes/tests')

app.use('/api/books', booksRouter)
app.use('/api/tests', testRouter)

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
// app.get('/express_backend', (req, res) => {
//   res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' })
// });

// Route to get book formats
// router.get('/formats', (req, res) => {
//   res.json(bookFormats); // Send bookFormats as JSON
// });