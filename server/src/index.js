const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

//Load env var
dotenv.config();

//Connect to DB
connectDB();

//Start Express
const app = express();

//Middleware
app.use(cors());
app.use(express.json());

// Routes:

//Test Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Budget App is running' });
});

const PORT = process.env.PORT || 3000;

//LISTEN
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
