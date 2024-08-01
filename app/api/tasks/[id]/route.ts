// app/api/tasks/[id]/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getTodoById, updateTodo, deleteTodo } from '@/lib/todo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const todo = await getTodoById(id as string);
    res.json(todo);
  } else if (req.method === 'PUT') {
    const updated = await updateTodo(id as string, req.body);
    res.json({ success: updated });
  } else if (req.method === 'DELETE') {
    const deleted = await deleteTodo(id as string);
    res.json({ success: deleted });
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
