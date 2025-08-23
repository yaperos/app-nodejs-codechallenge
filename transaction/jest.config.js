module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/*.d.ts",
        "!src/**/index.ts"
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["json", "lcov", "text", "clover"],
};
