/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  rootDir: '.',
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['**/*.(t|j)s'],
  coveragePathIgnorePatterns: ['/node_modules'],
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'ts', 'json'],
  moduleDirectories: ['node_modules', 'src'],
  modulePaths: ['<rootDir>'],
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  verbose: true,
  watchPathIgnorePatterns: ['node_modules'],
};

export default config;
