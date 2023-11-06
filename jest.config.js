// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: [
    '.module.ts',
    '.enum.ts',
    '<rootDir>/config/',
    '<rootDir>/database/models/',
    '<rootDir>/database/migrations/',
    'app.service.ts',
    'main.ts',
  ],
  testEnvironment: 'node',
  moduleNameMapper: {
    '@shared/(.*)': '<rootDir>/shared/$1',
    '@modules/(.*)': '<rootDir>/modules/$1',
    '@entities/(.*)': '<rootDir>/database/models/$1',
    '@config/(.*)': '<rootDir>/config/$1',
  },
};
