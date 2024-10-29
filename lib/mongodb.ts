// 
/**
 * lib/mongodb.ts
 * Manages the connection to MongoDB and provides a database instance.
 * 
 * This module initializes a singleton MongoDB client and connects to the database.
 * The connection is maintained globally in development to prevent creating multiple
 * client instances during hot reloads. It exports a `dbConnect` function to retrieve
 * the database instance, which can be used across the application for database operations.
 * 
 * @returns The database instance connected to MongoDB.
 * @throws Error - If `MONGODB_URI` is missing in the environment configuration.
 */

import { MongoClient } from 'mongodb';

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(process.env.MONGODB_URI as string);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(process.env.MONGODB_URI as string);
  clientPromise = client.connect();
}

async function dbConnect() {
  const client = await clientPromise;
  return client.db();
}

export default dbConnect;
