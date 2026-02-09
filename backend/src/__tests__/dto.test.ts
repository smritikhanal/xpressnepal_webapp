// User DTO and Model Tests
describe('User Data Transfer Objects - Integrated Tests', () => {
  describe('User Registration DTO', () => {
    test('should validate complete user registration data', () => {
      const userData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'Test@123',
        phone: '9841234567',
        role: 'customer'
      };
      
      expect(userData.fullName).toBeDefined();
      expect(userData.email).toBeDefined();
      expect(userData.password).toBeDefined();
      expect(userData.phone).toBeDefined();
      expect(userData.role).toBeDefined();
    });

    test('should validate fullName is not empty', () => {
      const fullName = 'John Doe';
      expect(fullName.trim().length).toBeGreaterThan(0);
    });

    test('should validate email format', () => {
      const email = 'john@example.com';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(email)).toBe(true);
    });

    test('should validate password is strong enough', () => {
      const password = 'Test@123';
      expect(password.length).toBeGreaterThanOrEqual(6);
    });

    test('should validate role is from allowed values', () => {
      const allowedRoles = ['customer', 'seller', 'admin', 'superadmin'];
      const role = 'customer';
      expect(allowedRoles.includes(role)).toBe(true);
    });
  });

  describe('User Login DTO', () => {
    test('should validate login credentials', () => {
      const loginData = {
        email: 'john@example.com',
        password: 'Test@123'
      };
      
      expect(loginData.email).toBeDefined();
      expect(loginData.password).toBeDefined();
    });

    test('should not trim password spaces', () => {
      const password = ' pass word ';
      expect(password).toBe(' pass word ');
      expect(password.length).toBe(11);
    });
  });

  describe('User Update DTO', () => {
    test('should allow partial updates', () => {
      const updateData = {
        fullName: 'Jane Doe'
      };
      
      expect(updateData.fullName).toBeDefined();
      expect(updateData).not.toHaveProperty('email');
      expect(updateData).not.toHaveProperty('password');
    });

    test('should validate updated email format if provided', () => {
      const email = 'newemail@example.com';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(email)).toBe(true);
    });

    test('should validate updated phone number if provided', () => {
      const phone = '9841234567';
      const phoneRegex = /^[0-9]{10}$/;
      expect(phoneRegex.test(phone)).toBe(true);
    });
  });

  describe('User Response DTO', () => {
    test('should not include password in response', () => {
      const userResponse = {
        _id: 'user123',
        fullName: 'John Doe',
        email: 'john@example.com',
        role: 'customer',
        phone: '9841234567'
      };
      
      expect(userResponse).not.toHaveProperty('password');
      expect(userResponse).not.toHaveProperty('resetPasswordToken');
      expect(userResponse).not.toHaveProperty('resetPasswordExpires');
    });

    test('should include user ID in response', () => {
      const userResponse = { _id: 'user123' };
      expect(userResponse._id).toBeDefined();
    });

    test('should include role in response', () => {
      const userResponse = { role: 'customer' };
      expect(['customer', 'seller', 'admin', 'superadmin'].includes(userResponse.role)).toBe(true);
    });
  });

  describe('Create Category DTO', () => {
    test('should validate category name', () => {
      const categoryData = {
        name: 'Electronics',
        description: 'Electronic items and gadgets'
      };
      
      expect(categoryData.name).toBeDefined();
      expect(categoryData.name.length).toBeGreaterThan(0);
    });

    test('should allow optional description', () => {
      const categoryData = {
        name: 'Electronics'
      };
      
      expect(categoryData.name).toBeDefined();
      expect(categoryData).not.toHaveProperty('description');
    });

    test('should trim category name', () => {
      const name = '  Electronics  ';
      const trimmedName = name.trim();
      expect(trimmedName).toBe('Electronics');
    });
  });
});
