import { CreateUserDTO, LoginUserDTO } from '../dtos/user.dtos';

describe('User DTOs', () => {
  describe('CreateUserDTO', () => {
    it('should validate correct user data', () => {
      const validUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'customer',
      };

      const result = CreateUserDTO.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidUser = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
      };

      const result = CreateUserDTO.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const invalidUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123',
      };

      const result = CreateUserDTO.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject invalid role', () => {
      const invalidUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'invalid_role',
      };

      const result = CreateUserDTO.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });
  });

  describe('LoginUserDTO', () => {
    it('should validate correct login data', () => {
      const validLogin = {
        email: 'john@example.com',
        password: 'password123',
      };

      const result = LoginUserDTO.safeParse(validLogin);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidLogin = {
        email: 'invalid-email',
        password: 'password123',
      };

      const result = LoginUserDTO.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const invalidLogin = {
        email: 'john@example.com',
      };

      const result = LoginUserDTO.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });
  });
});
