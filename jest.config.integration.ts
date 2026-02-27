import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

/**
 * Integration Test Configuration
 * 
 * Integration tests focus on testing how multiple components/modules work together.
 * They can:
 * - Make real API calls to test endpoints
 * - Test database interactions
 * - Test end-to-end user flows
 * - Be slower than unit tests (acceptable > 1s per test)
 */
const config: Config = {
  displayName: 'integration',
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  // Only include integration tests
  testMatch: [
    '<rootDir>/__tests__/integration/**/*.[jt]s?(x)',
    '<rootDir>/__tests__/**/*.integration.[jt]s?(x)',
  ],
  
  modulePathIgnorePatterns: ['<rootDir>/backend/'],
  
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'store/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  
  // Integration tests may need more time
  testTimeout: 10000,
};

export default createJestConfig(config);
