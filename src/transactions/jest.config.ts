import type { Config } from "jest";

const config: Config = {
  roots: ["<rootDir>"],
  projects: [
    {
      displayName: "unit",
      preset: "ts-jest",
      testEnvironment: "node",
      testMatch: ["<rootDir>/modules/**/__tests__/**/*.spec.ts"],
      moduleFileExtensions: ["ts", "js"],
      transform: {
        "^.+\\.(ts|tsx)$": [
          "ts-jest",
          {
            tsconfig: "<rootDir>/tsconfig.json"
          }
        ]
      }
    },
    {
      displayName: "integration",
      preset: "ts-jest",
      testEnvironment: "node",
      testMatch: ["<rootDir>/tests/integration/**/*.spec.ts"],
      moduleFileExtensions: ["ts", "js"],
      transform: {
        "^.+\\.(ts|tsx)$": [
          "ts-jest",
          {
            tsconfig: "<rootDir>/tsconfig.json"
          }
        ]
      }
    }
  ]
};

export default config;
