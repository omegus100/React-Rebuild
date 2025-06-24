import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import axios from 'axios';
// import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import bookRouter from './server/routes/books.js';
import authorRouter from './server/routes/authors.js';
import seriesRouter from './server/routes/series.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// app.use(cors());
app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Proxy route to fetch images from external URLs
app.get('/proxy', async (req, res) => {
  const { url } = req.query;
  console.log('Proxy request received for URL:', url);
  try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      res.set('Content-Type', response.headers['content-type']);
      res.set('Access-Control-Allow-Origin', '*');
      res.send(response.data);
  } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).send('Error fetching image');
  }
});

app.use('/api/books', bookRouter);
app.use('/api/authors', authorRouter);
app.use('/api/series', seriesRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => console.log(`Listening on port ${port}`));