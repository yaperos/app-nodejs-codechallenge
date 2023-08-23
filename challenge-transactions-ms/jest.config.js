require('dotenv').config();
module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  modulePaths: ['<rootDir>'],
  coverageDirectory: 'reports/coverage-result/unit',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['node_modules'],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  reporters: [
    'default',
    [
      'jest-stare',
      {
        log: false,
        resultDir: 'reports/test-result/unit',
        reportSummary: false,
        reportTitle: 'Unit Testing Results',
        reportHeadline: 'Unit Testing Results',
        additionalResultsProcessors: ['jest-junit'],
        coverageLink: '../../coverage-result/unit/lcov-report/index.html',
        jestStareConfigJson: 'jest-stare.json',
        jestGlobalConfigJson: 'globalStuff.json',
      },
    ],
    [
      'jest-junit',
      {
        outputDirectory: 'reports/test-result/junit',
        outputName: 'unit.xml',
      },
    ],
    [
      'jest-sonar',
      {
        outputDirectory: 'reports/test-result/jest-sonar',
        outputName: 'unit.xml',
      },
    ],
  ],
};
