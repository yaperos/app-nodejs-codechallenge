module.exports = {
  testEnvironment: 'node',
  resolver: './jest-resolver.cjs',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest'],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: [
    '**/__tests__/**/*.spec.ts',
    '**/__tests__/**/*.test.ts'
  ],
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/**/__tests__/**/*.spec.ts'],
      testPathIgnorePatterns: ['/node_modules/', '.*\\.integration\\.spec\\.ts$']
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/**/__tests__/**/*.integration.spec.ts'],
      testTimeout: 60000
    }
  ],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'modules/**/*.ts',
    'messaging/**/*.ts',
    'http/**/*.ts',
    '!**/*.d.ts',
    '!**/__tests__/**',
    '!**/node_modules/**',
    '!**/dist/**'
  ]
};