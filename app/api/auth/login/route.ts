// app/api/auth/login/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import { verifyPassword, IUser } from '@/models/User';
import { generateToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', ['POST']).status(405).end('Method Not Allowed');
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const db = await dbConnect();
    const usersCollection = db.collection<IUser>('users');

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString());
    res.status(200).json({ success: true, token, message: 'Logged in successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: (error as Error).message });
  }
}
