import { createMocks } from 'node-mocks-http';
import { PUT } from '@/app/api/tasks/[id]/route';
import dbConnect from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

jest.mock('@/lib/mongodb');
jest.mock('@/lib/auth');

const mockDb = {
  collection: jest.fn().mockReturnThis(),
  findOne: jest.fn(),  // Certifique-se de que findOne está mockado corretamente
  updateOne: jest.fn(),  // Adiciona o mock da função updateOne
};

(dbConnect as jest.Mock).mockResolvedValue(mockDb);

describe('/api/tasks/[id] API Endpoint', () => {
  const userId = new ObjectId().toHexString();
  const taskId = new ObjectId().toHexString();
  const token = `Bearer ${userId}`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update a task', async () => {
    (verifyToken as jest.Mock).mockImplementation(() => ({ userId }));

    const existingTask = {
      _id: taskId,
      title: 'Task to Test',
      completed: false,
      userId,
    };

    const updatedTask = {
      _id: taskId,
      title: 'Task to Test',
      completed: true,
      userId,
    };

    // Mock findOne para simular que a tarefa existe
    mockDb.findOne.mockResolvedValue(existingTask);

    // Mock updateOne para simular a atualização da tarefa
    mockDb.updateOne.mockResolvedValue({
      matchedCount: 1, // Indica que uma tarefa foi encontrada e atualizada
      modifiedCount: 1, // Indica que uma tarefa foi modificada
    });

    // Mock findOne para retornar a tarefa atualizada após a atualização
    mockDb.findOne.mockResolvedValue(updatedTask);

    const headers = new Headers({
      authorization: `Bearer ${token}`,
    });

    const request = new Request(`http://localhost:3000/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({ completed: true }),
    });

    const response = await PUT(request, { params: { id: taskId } });

    console.log('Response status:', response.status);
    const json = await response.json();
    console.log('Response JSON:', json);

    expect(response.status).toBe(200); // Garantindo que a resposta seja 200
    expect(json.success).toBe(true);
    expect(json.task).toEqual(updatedTask);

    // Verifica se a função findOne foi chamada corretamente
    expect(mockDb.findOne).toHaveBeenCalledWith({
      _id: new ObjectId(taskId),
      userId: new ObjectId(userId),
    });
  });
});
