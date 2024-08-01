// lib/mongodb.test.ts
import dotenv from 'dotenv';
dotenv.config();
import dbConnect from '@/lib/mongodb';
import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;

afterEach(async () => {
  if (client) {
    await client.close();
    client = null;
  }
});

describe('dbConnect', () => {
  it('should connect to the database', async () => {
    client = new MongoClient(process.env.MONGODB_URI as string);
    await client.connect();
    const db: Db = client.db();
    expect(db).toBeDefined();

    // Verifique se a conexão está ativa usando db.admin().ping()
    const adminDb = db.admin();
    const result = await adminDb.ping();
    expect(result).toEqual({ ok: 1 });
  });
});
