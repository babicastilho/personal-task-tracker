// app/api/auth/login.ts

import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { email, password } = req.body;

  if (req.method === 'POST') {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
      }

      const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
      res.status(200).json({ success: true, token, message: 'Logged in successfully' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
      } else {
        res.status(500).json({ success: false, message: 'An unknown error occurred' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
