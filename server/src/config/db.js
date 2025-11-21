const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_URL);
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Mongo connected: ${conn.connection.host}`);
  } catch (err) {
    console.log('Mongo DB connection error: ', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
