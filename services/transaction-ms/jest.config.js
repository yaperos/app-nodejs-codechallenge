module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.+(spec|test).ts?(x)"],
  clearMocks: true,
  coverageThreshold: {
    global: {
      statements: 80,
    },
  },
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
};
