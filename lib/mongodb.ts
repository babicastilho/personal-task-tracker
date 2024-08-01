// lib/mongodb.ts
import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let client: MongoClient;
let db: Db;

/**
 * Connects to the MongoDB database and returns the Db instance.
 * @returns A promise that resolves to the Db instance.
 */
async function dbConnect(): Promise<Db> {
  if (db) return db;

  client = new MongoClient(uri, {
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    db = client.db(); // use your database name if needed
    console.log('Connected to database!');
    return db;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}

export default dbConnect;
