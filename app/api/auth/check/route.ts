// app/api/auth/check/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.setHeader('Allow', ['GET']).status(405).end('Method Not Allowed');
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = verifyToken(token);
    res.status(200).json({ success: true, message: 'Authenticated', user: decoded });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token', error: (error as Error).message });
  }
}
