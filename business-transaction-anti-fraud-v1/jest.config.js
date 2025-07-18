module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.spec.ts'],
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/*.spec.ts',
    '!src/**/*.interface.ts',
    '!**/node_modules/**',
    '!src/model/**',
  ],
  coverageDirectory: './coverage',
  testTimeout: 10000,
};
