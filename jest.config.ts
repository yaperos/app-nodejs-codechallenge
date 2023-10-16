import { resolve } from 'path';

module.exports = {
  roots: ['<rootDir>/'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: {
    '^@logger/(.*)$': resolve(__dirname, './modules/logger/$1'),
    '^constants/(.*)$': resolve(__dirname, './constants/$1'),
  },
  testMatch: [
    '**/__tests__/**/*.spec.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
};
