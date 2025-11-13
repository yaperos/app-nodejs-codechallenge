import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: 'tsconfig.spec.json' }],
  },
  moduleNameMapper: {
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@ports/(.*)$': '<rootDir>/src/ports/$1',
    '^@adapters/(.*)$': '<rootDir>/src/adapters/$1',
    '^@infra/(.*)$': '<rootDir>/src/infra/$1',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: '../coverage/anti-fraud-service',
  testEnvironment: 'node',
};

export default config;
