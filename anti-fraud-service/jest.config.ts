import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],  // Carpeta raíz para los tests
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testMatch: ['**/__tests__/**/*.test.ts'], // Ubicación de las pruebas
  clearMocks: true, // Limpia mocks después de cada test
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Archivo de configuración adicional
};

export default config;
