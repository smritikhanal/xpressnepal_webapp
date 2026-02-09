import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock bcrypt
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Utils', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const mockHash = 'hashed_password';
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

      const password = 'password123';
      const result = await hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(mockHash);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching passwords', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await comparePassword('password123', 'hashed_password');

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
    });

    it('should return false for non-matching passwords', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await comparePassword('wrongpassword', 'hashed_password');

      expect(result).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      const mockToken = 'mock.jwt.token';
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const userId = 'user123';
      const role = 'customer';
      const result = generateToken(userId, role);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: userId, role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      expect(result).toBe(mockToken);
    });
  });
});
