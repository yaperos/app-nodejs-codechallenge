module.exports = {
  roots: ['.', '../src'],
  collectCoverage: true,
  collectCoverageFrom: [
    '../src/**/*.{ts,js}',
  ],
  coverageDirectory: './coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
