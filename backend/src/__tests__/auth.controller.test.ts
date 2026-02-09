// Comprehensive Auth Controller Tests
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

describe('Auth Controller - Integrated Tests', () => {
  describe('Password Hashing', () => {
    test('should hash a password successfully', async () => {
      const password = 'testPassword123';
      const hashedPassword = await hashPassword(password);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    test('should generate different hashes for same password', async () => {
      const password = 'testPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });

    test('should handle empty password', async () => {
      const password = '';
      const hashedPassword = await hashPassword(password);
      
      expect(hashedPassword).toBeDefined();
    });
  });

  describe('Password Comparison', () => {
    test('should return true for matching password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await hashPassword(password);
      const result = await comparePassword(password, hashedPassword);
      
      expect(result).toBe(true);
    });

    test('should return false for non-matching password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword456';
      const hashedPassword = await hashPassword(password);
      const result = await comparePassword(wrongPassword, hashedPassword);
      
      expect(result).toBe(false);
    });

    test('should be case sensitive', async () => {
      const password = 'TestPassword123';
      const hashedPassword = await hashPassword(password);
      const result = await comparePassword('testpassword123', hashedPassword);
      
      expect(result).toBe(false);
    });

    test('should handle special characters in password', async () => {
      const password = 'Test@Pass#123!';
      const hashedPassword = await hashPassword(password);
      const result = await comparePassword(password, hashedPassword);
      
      expect(result).toBe(true);
    });
  });

  describe('JWT Token Generation', () => {
    test('should generate a valid JWT token', () => {
      const userId = 'user123';
      const role = 'customer';
      const token = generateToken(userId, role);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    test('should generate different tokens for different users', () => {
      const token1 = generateToken('user1', 'customer');
      const token2 = generateToken('user2', 'customer');
      
      expect(token1).not.toBe(token2);
    });

    test('should generate different tokens for different roles', () => {
      const token1 = generateToken('user1', 'customer');
      const token2 = generateToken('user1', 'admin');
      
      expect(token1).not.toBe(token2);
    });

    test('should handle seller role', () => {
      const token = generateToken('seller123', 'seller');
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    test('should handle superadmin role', () => {
      const token = generateToken('admin123', 'superadmin');
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });

  describe('Password Security', () => {
    test('should handle long passwords', async () => {
      const longPassword = 'a'.repeat(100);
      const hashedPassword = await hashPassword(longPassword);
      const result = await comparePassword(longPassword, hashedPassword);
      
      expect(result).toBe(true);
    });

    test('should handle passwords with unicode characters', async () => {
      const unicodePassword = 'Test密码🔒Pass';
      const hashedPassword = await hashPassword(unicodePassword);
      const result = await comparePassword(unicodePassword, hashedPassword);
      
      expect(result).toBe(true);
    });

    test('should handle passwords with spaces', async () => {
      const passwordWithSpaces = 'Test Pass 123';
      const hashedPassword = await hashPassword(passwordWithSpaces);
      const result = await comparePassword(passwordWithSpaces, hashedPassword);
      
      expect(result).toBe(true);
    });
  });
});
