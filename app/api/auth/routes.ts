// app/auth/routes.ts

import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({ success: false, message: 'Server configuration error' });
  }

  const { method } = req;
  const { action, username, email, password } = req.body;

  if (method === 'POST') {
    switch (action) {
      case 'register':
        try {
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already in use' });
          }

          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = new User({
            username,
            email,
            password: hashedPassword
          });

          await newUser.save();
          res.status(201).json({ success: true, message: 'User registered successfully' });
        } catch (error: unknown) {
          if (error instanceof Error) {
            res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
          } else {
            res.status(500).json({ success: false, message: 'An unknown error occurred' });
          }
        }
        break;

      case 'login':
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Incorrect password' });
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
        break;

      default:
        res.status(400).json({ success: false, message: 'Invalid action' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
