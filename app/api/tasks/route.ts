// app/api/tasks/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getTodos, addTodo } from '@/lib/todo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const todos = await getTodos();
    res.json(todos);
  } else if (req.method === 'POST') {
    const todo = await addTodo(req.body);
    res.status(201).json(todo);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
