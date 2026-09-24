const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillswap';
  
  // Disable query buffering so if connection drops, requests return immediately instead of hanging 10s
  mongoose.set('bufferCommands', false);

  try {
    console.log(`Attempting connection to MongoDB at: ${mongoURI.split('@').pop()}...`);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });

    console.log(`[MongoDB Connected]: ${conn.connection.host} (${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.warn(`[Primary MongoDB Connection Failed]: ${error.message}`);
    console.log(`Starting automated in-memory MongoDB server as fallback for instant development...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const inMemoryURI = mongod.getUri();

      const conn = await mongoose.connect(inMemoryURI);
      console.log(`=======================================================`);
      console.log(`[MongoDB In-Memory Active]: ${inMemoryURI}`);
      console.log(`App is now 100% functional with zero setup required!`);
      console.log(`To persist to MongoDB Atlas, add your Atlas URI to server/.env`);
      console.log(`=======================================================`);

      // Automatically seed initial sample users if database is empty
      const User = require('../models/User');
      const count = await User.countDocuments();
      if (count === 0) {
        console.log('Seeding initial demo student profiles...');
        require('../seed/seedData');
      }

      return conn;
    } catch (memError) {
      console.error(`[In-Memory MongoDB Error]: ${memError.message}`);
      console.error(`Please make sure your MongoDB Atlas URI is added in server/.env`);
    }
  }
};

module.exports = connectDB;
