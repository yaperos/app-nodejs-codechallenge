import type { Config } from 'jest';
const config: Config = {
  testEnvironment: 'node',
  roots: ['<rootDir>/apps', '<rootDir>/libs'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: {
    '^.+\\.(t|j)s$': ['@swc/jest', {
      jsc: {
        parser: { syntax: 'typescript', decorators: true },
        transform: { legacyDecorator: true, decoratorMetadata: true },
        target: 'es2020',
      },
      module: { type: 'commonjs' },
    }],
  },
  moduleNameMapper: {
    '^@shared/contracts/(.*)$': '<rootDir>/libs/contracts/src/$1',
    '^@shared/contracts$': '<rootDir>/libs/contracts/src',
    '^@shared/messaging/messaging-kafka/(.*)$': '<rootDir>/libs/messaging/messaging-kafka/src/$1',
    '^@shared/messaging/messaging-kafka$': '<rootDir>/libs/messaging/messaging-kafka/src',
    '^@shared/messaging/(.*)$': '<rootDir>/libs/messaging/src/$1',
    '^@shared/messaging$': '<rootDir>/libs/messaging/src',
    '^@shared/db/(.*)$': '<rootDir>/libs/db/src/$1',
    '^@shared/db$': '<rootDir>/libs/db/src',
    '^@shared/logging/(.*)$': '<rootDir>/libs/logging/src/$1',
    '^@shared/logging$': '<rootDir>/libs/logging/src',
    '^@shared/cache/(.*)$': '<rootDir>/libs/cache/src/$1',
    '^@shared/cache$': '<rootDir>/libs/cache/src',
    '^@shared/config/(.*)$': '<rootDir>/libs/config/src/$1',
    '^@shared/config$': '<rootDir>/libs/config/src',
    '^@shared/(.*)$': '<rootDir>/libs/$1/src',
  },
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'apps/**/*.(t|j)s',
    'libs/**/*.(t|j)s',
    '!**/*.d.ts',
    '!**/index.ts',
  ],
};
export default config;