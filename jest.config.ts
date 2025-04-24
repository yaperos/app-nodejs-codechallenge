// jest.config.ts o jest.config.js
module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    collectCoverageFrom: [
      'src/**/*.{ts,js}',
      '!src/main.ts',
      '!src/app.module.ts',
      '!src/modules/transaction/infrastructure/prisma/prisma.*',
      '!src/modules/transaction/domain/entities/*',
    ],
    coverageDirectory: './coverage',
    coverageReporters: ['text', 'lcov'],
    testEnvironment: 'node',
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json',
      },
    },
  };
  