import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

/**
 * Unit Test Configuration
 * 
 * Unit tests focus on testing individual functions, components, and modules in isolation.
 * They should:
 * - Be fast (< 100ms per test)
 * - Not make real API calls
 * - Not depend on external services
 * - Use mocks and stubs for dependencies
 */
const config: Config = {
  displayName: 'unit',
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  // Only include unit tests (excluding integration folder)
  testMatch: [
    '<rootDir>/__tests__/**/!(integration)/**/*.[jt]s?(x)',
    '<rootDir>/__tests__/**/!(*.integration).[jt]s?(x)',
  ],
  
  // Exclude integration tests explicitly
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/integration/',
    '.integration.test.',
    '.integration.spec.',
  ],
  
  modulePathIgnorePatterns: ['<rootDir>/backend/'],
  
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'store/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/integration/**',
  ],
  
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  
  // Speed up tests
  maxWorkers: '50%',
};

export default createJestConfig(config);
