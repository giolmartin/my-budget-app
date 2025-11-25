const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const settingsRoutes = require('./routes/settings');
const goalsRoutes = require('./routes/goals');
const budgetRoutes = require('./routes/budgets');

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

//Mount under /api
app.use('/api', settingsRoutes);
app.use('/api', goalsRoutes);
app.use('/api', budgetRoutes);

//Error Handling middleware.
//For any next(err) handling it lands here.

app.use((err, req, res, next) => {
  console.log('Error: ', err);
  const status = err.statusCode || 500;

  res.status(status).json({ error: err.message || 'Internal Server Error' });
});
const PORT = process.env.PORT || 3000;

//LISTEN
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
