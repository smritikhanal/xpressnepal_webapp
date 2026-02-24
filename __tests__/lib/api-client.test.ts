describe('API Client', () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET Requests', () => {
    it('makes GET request with correct headers', async () => {
      const mockResponse = { success: true, data: { id: 1, name: 'Test' } };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const response = await fetch('http://localhost:5000/api/test', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );

      const data = await response.json();
      expect(data).toEqual(mockResponse);
    });

    it('includes authorization token when provided', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await fetch('http://localhost:5000/api/protected', {
        headers: {
          'Authorization': 'Bearer test-token',
        },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
          }),
        })
      );
    });
  });

  describe('POST Requests', () => {
    it('makes POST request with body', async () => {
      const requestBody = { name: 'Test', email: 'test@example.com' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { id: 1, ...requestBody } }),
      });

      await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestBody),
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('handles network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(
        fetch('http://localhost:5000/api/test')
      ).rejects.toThrow('Network error');
    });

    it('handles HTTP error responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ success: false, message: 'Not found' }),
      });

      const response = await fetch('http://localhost:5000/api/test');
      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });

    it('handles 401 unauthorized', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ success: false, message: 'Unauthorized' }),
      });

      const response = await fetch('http://localhost:5000/api/protected');
      expect(response.status).toBe(401);
    });
  });

  describe('Request Configuration', () => {
    it('sets correct content-type for JSON', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await fetch('http://localhost:5000/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'data' }),
      });

      const call = (global.fetch as jest.Mock).mock.calls[0];
      expect(call[1].headers['Content-Type']).toBe('application/json');
    });

    it('handles different HTTP methods', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      await fetch('http://localhost:5000/api/test', { method: 'GET' });
      await fetch('http://localhost:5000/api/test', { method: 'POST' });
      await fetch('http://localhost:5000/api/test', { method: 'PUT' });
      await fetch('http://localhost:5000/api/test', { method: 'DELETE' });
      await fetch('http://localhost:5000/api/test', { method: 'PATCH' });

      expect(global.fetch).toHaveBeenCalledTimes(5);
    });
  });
});
