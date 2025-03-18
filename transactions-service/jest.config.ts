import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],  
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testMatch: ['**/__tests__/**/*.test.ts'], 
  clearMocks: true, 
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], 
};

export default config;
