import mongoose from 'mongoose';

let isMockMode = false;

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hyperlocal';
    console.log(`Connecting to MongoDB at: ${connStr}...`);
    
    // Set connection timeout to 3 seconds so we don't hang if Mongo isn't running
    mongoose.set('strictQuery', false);
    await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });
    
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    isMockMode = false;
  } catch (error) {
    console.warn('\n===============================================================');
    console.warn('WARNING: Failed to connect to MongoDB!');
    console.warn(error.message);
    console.warn('Starting backend in simulated demo mode with in-memory fallback.');
    console.warn('===============================================================\n');
    isMockMode = true;
  }
};

export const getDbStatus = () => {
  return {
    connected: mongoose.connection.readyState === 1,
    isMockMode
  };
};
