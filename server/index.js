const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define schema and model
const dataSchema = new mongoose.Schema({
  user_id: String,
  email: String,
  roll_number: String,
  numbers: [String],
  alphabets: [String],
  highest_alphabet: [String],
});

const Data = mongoose.model('Data', dataSchema);

// Helper function to get the highest alphabet
const getHighestAlphabet = (alphabets) => {
  if (alphabets.length === 0) return [];
  return [alphabets.sort((a, b) => a.toLowerCase() < b.toLowerCase() ? 1 : -1)[0]];
};

// POST /bfhl endpoint
app.post('/bfhl', async (req, res) => {
  const data = req.body.data;

  if (!Array.isArray(data)) {
    return res.status(400).json({
      is_success: false,
      message: 'Invalid input data. Expected an array.'
    });
  }

  const userId = 'john_doe_17091999';
  const email = 'john@xyz.com';
  const rollNumber = 'ABCD123';

  const numbers = data.filter(item => !isNaN(item));
  const alphabets = data.filter(item => isNaN(item));
  const highestAlphabet = getHighestAlphabet(alphabets);

  const newData = new Data({
    user_id: userId,
    email: email,
    roll_number: rollNumber,
    numbers: numbers,
    alphabets: alphabets,
    highest_alphabet: highestAlphabet,
  });

  try {
    await newData.save();
    res.status(200).json({
      is_success: true,
      user_id: userId,
      email: email,
      roll_number: rollNumber,
      numbers: numbers,
      alphabets: alphabets,
      highest_alphabet: highestAlphabet,
    });
  } catch (error) {
    res.status(500).json({
      is_success: false,
      message: 'Error saving data to the database',
    });
  }
});

// GET /bfhl endpoint
app.get('/bfhl', (req, res) => {
  res.status(200).json({
    operation_code: 1
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
