import { createMocks } from 'node-mocks-http';
import { GET } from '@/app/api/auth/check/route';
import { verifyToken } from '@/lib/auth';

// Mock the verifyToken function
jest.mock('@/lib/auth', () => ({
  verifyToken: jest.fn(), // Mock the verifyToken function
}));

describe('GET /api/auth/check', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock history before each test
  });

  it('should return 200 when token is valid', async () => {
    const mockToken = 'validtoken';

    // Create a mock request with the token
    const { req } = createMocks({
      method: 'GET',
      headers: {
        authorization: `Bearer ${mockToken}`,
      },
    });

    // Mock verifyToken to return a decoded user when a valid token is passed
    (verifyToken as jest.Mock).mockReturnValueOnce({ userId: 'userId' });

    // Check if the verifyToken mock is called
    console.log('Mock verifyToken function:', verifyToken);

    // Create headers object with valid token
    const headers = new Headers({
      authorization: `Bearer ${mockToken}`,
    });

    // Convert the mocked request to a Request object with headers
    const request = new Request('http://localhost:3000/api/auth/check', {
      method: 'GET',
      headers: headers,
    });

    console.log('Request headers:', request.headers.get('authorization')); // Verifique se o header está sendo passado corretamente

    // Call the GET handler
    const response = await GET(request);

    // Log the response status to verify if it is correct
    console.log('Response status:', response.status);

    // Check if the response status is 200 (OK)
    expect(response.status).toBe(200);

    // Parse the JSON response
    const json = await response.json();
    console.log('Response JSON:', json); // Verifique o conteúdo JSON da resposta

    // Check if the JSON matches the expected structure
    expect(json).toEqual({
      success: true,
      message: 'Authenticated',
      user: { userId: 'userId' }, // Expected user object
    });
  });

  // Other test cases remain unchanged
});
