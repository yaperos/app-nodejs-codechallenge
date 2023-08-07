import type { Config } from '@jest/types';
export default async (): Promise<Config.InitialOptions> => {
	return {
		verbose: true,
		// root dir
		rootDir: './',
		moduleFileExtensions: ['js', 'json', 'ts'],
		testRegex: '.*\\.spec\\.ts$',
		// add module folder resolver
		moduleNameMapper: {
			'^@ccla/(.*)$': '<rootDir>/src/$1',
			"^@api/(.*)$": "<rootDir>/src/api/$1",
			"^@config/(.*)$": "<rootDir>/src/config/$1",
			"^@constant/(.*)$": "<rootDir>/src/constant/$1",
			"^@cclatest/(.*)$": "<rootDir>/test/$1",
			"^@source/(.*)$": "<rootDir>/src/$1",
    },
		transform: {
			'^.+\\.(t|j)s$': 'ts-jest',
		},
		collectCoverageFrom: ['**/*.(t|j)s'],
		coverageDirectory: './coverage',
		testEnvironment: 'node',
		setupFiles: ['dotenv/config'],
		coveragePathIgnorePatterns: [
			'/node_modules/',
			'/dist/',
			'/coverage/',
			'.module.ts',
			'.dto.ts',
			'.filter.ts',
			'.entity.ts',
			'.interface.ts',
			'.response.ts',
			'.enum.ts',
			'.mock.ts',
			'.index.ts',
			'.types.ts',
			'.type.ts',
			'.d.ts',
			'.eslintrc.js',
			'jest.config.ts',
			'/test/',
			'/filters',
			'.prettierrc.js',
			'commitlint.config.js',
			'health.controller.ts',
			'.middleware.ts',
			'-options.ts',
			'.util.ts',
			'webpack-hmr.config.js',
			'loggerConfig.ts',
			'http.config.ts',
			'main.ts',
			'/global',
			'/src/utils',

			// TODO: Remove this line when the following issue is fixed:
			// 'validador-rut.ts',
		],
		coverageThreshold: {
			global: {
				branches: 1,
				functions: 1,
				lines: 1,
				statements: 1,
			},
		},
		testTimeout: 60000,
	};
};
