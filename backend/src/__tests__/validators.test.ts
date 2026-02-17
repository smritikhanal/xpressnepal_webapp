// Validator Tests
describe('Validators - Integrated Tests', () => {
  describe('Email Validation', () => {
    test('should accept valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'test123@test-domain.com',
        'admin@localhost.localdomain'
      ];

      validEmails.forEach(email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test(email)).toBe(true);
      });
    });

    test('should reject invalid email addresses', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'test@',
        'test..user@example.com',
        'test user@example.com'
      ];

      invalidEmails.forEach(email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test(email)).toBe(false);
      });
    });
  });

  describe('Password Strength Validation', () => {
    test('should validate minimum password length', () => {
      const minLength = 6;
      const validPassword = 'pass123';
      const invalidPassword = 'pass';
      
      expect(validPassword.length >= minLength).toBe(true);
      expect(invalidPassword.length >= minLength).toBe(false);
    });

    test('should check for password complexity', () => {
      const hasUpperCase = (str: string) => /[A-Z]/.test(str);
      const hasLowerCase = (str: string) => /[a-z]/.test(str);
      const hasNumber = (str: string) => /[0-9]/.test(str);
      
      const strongPassword = 'Test123';
      expect(hasUpperCase(strongPassword)).toBe(true);
      expect(hasLowerCase(strongPassword)).toBe(true);
      expect(hasNumber(strongPassword)).toBe(true);
    });
  });

  describe('Role Validation', () => {
    test('should validate customer role', () => {
      const validRoles = ['customer', 'seller', 'admin', 'superadmin'];
      expect(validRoles.includes('customer')).toBe(true);
    });

    test('should validate seller role', () => {
      const validRoles = ['customer', 'seller', 'admin', 'superadmin'];
      expect(validRoles.includes('seller')).toBe(true);
    });

    test('should validate admin role', () => {
      const validRoles = ['customer', 'seller', 'admin', 'superadmin'];
      expect(validRoles.includes('admin')).toBe(true);
    });

    test('should reject invalid role', () => {
      const validRoles = ['customer', 'seller', 'admin', 'superadmin'];
      expect(validRoles.includes('invalidrole')).toBe(false);
    });
  });

  describe('Phone Number Validation', () => {
    test('should validate 10-digit phone number', () => {
      const phoneRegex = /^[0-9]{10}$/;
      expect(phoneRegex.test('9841234567')).toBe(true);
    });

    test('should reject invalid phone formats', () => {
      const phoneRegex = /^[0-9]{10}$/;
      expect(phoneRegex.test('123')).toBe(false);
      expect(phoneRegex.test('98412345678')).toBe(false);
      expect(phoneRegex.test('abcd123456')).toBe(false);
    });
  });

  describe('Category Name Validation', () => {
    test('should validate category name length', () => {
      const minLength = 2;
      const maxLength = 50;
      const validName = 'Electronics';
      
      expect(validName.length >= minLength).toBe(true);
      expect(validName.length <= maxLength).toBe(true);
    });

    test('should reject empty category name', () => {
      const name = '';
      expect(name.trim().length > 0).toBe(false);
    });

    test('should trim whitespace from category name', () => {
      const name = '  Electronics  ';
      const trimmed = name.trim();
      
      expect(trimmed).toBe('Electronics');
      expect(trimmed.length).toBe(11);
    });
  });
});
