// Jest setup file for backend tests

// Mock localStorage first before anything else
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
global.localStorage = localStorageMock as any;

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes';
process.env.MONGODB_URI = 'mongodb://localhost:27017/xpressnepal-test';
process.env.USER_EMAIL = 'test@example.com';
process.env.USER_EMAIL_KEY = 'test-password';

// Mock console methods to reduce test noise
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
