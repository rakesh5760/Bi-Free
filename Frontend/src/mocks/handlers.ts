import { http, HttpResponse } from 'msw';

// Mocked user database
const mockUser = {
  id: 'usr_123',
  name: 'Alex Developer',
  email: 'alex@student.edu',
  role: 'student',
  studentLevel: 'B',
  avatarUrl: 'https://i.pravatar.cc/150?u=alex'
};

export const handlers = [
  // Authentication Mock Endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as any;
    
    // Simple mock authentication logic
    if (email === 'mentor@skillforge.edu') {
      return HttpResponse.json({
        user: {
          id: 'usr_456',
          name: 'Sarah Mentor',
          email: 'mentor@skillforge.edu',
          role: 'mentor',
          avatarUrl: 'https://i.pravatar.cc/150?u=sarah'
        },
        token: 'mock-jwt-token-mentor123'
      });
    }

    if (email === 'client@skillforge.edu') {
      return HttpResponse.json({
        user: {
          id: 'usr_789',
          name: 'TechStart Corp',
          email: 'client@skillforge.edu',
          role: 'client',
          avatarUrl: 'https://i.pravatar.cc/150?u=techstart'
        },
        token: 'mock-jwt-token-client123'
      });
    }

    if (email && password) {
      return HttpResponse.json({
        user: mockUser,
        token: 'mock-jwt-token-ey1234567890'
      });
    }

    return new HttpResponse(null, {
      status: 401,
      statusText: 'Unauthorized',
    });
  }),
  
  http.get('/api/auth/me', () => {
    return HttpResponse.json({
      user: mockUser
    });
  }),
];
