import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import dbConnect from '@/lib/mongodb';
afterEach(async () => {
  if (mongoose.connection.readyState >= 1) {
    await mongoose.connection.close();
  }
});

describe('dbConnect', () => {
  it('should connect to the database', async () => {
    const mongooseInstance = await dbConnect();
    const connection = mongooseInstance.connection;
    expect(connection.readyState).toBe(1); // 1 means connected
  });
});
