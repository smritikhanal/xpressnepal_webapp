import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: [
    '<rootDir>/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/app/**/?(*.)+(spec|test).[jt]s?(x)',
    '<rootDir>/components/**/?(*.)+(spec|test).[jt]s?(x)',
    '<rootDir>/lib/**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  modulePathIgnorePatterns: ['<rootDir>/backend/'],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
export default createJestConfig(config);
