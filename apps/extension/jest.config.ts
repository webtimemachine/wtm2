import { type JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  rootDir: 'src',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    // process `*.tsx` files with `ts-jest`
  },
  moduleNameMapper: {
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.ts',
    // '^.+\\.(css|less|scss|sass)$': '<rootDir>/config/jest/styleMock.ts',
    'react-markdown': '<rootDir>/__mocks__/react-markdown.ts',
    'wouter/use-browser-location':
      '<rootDir>/__mocks__/use-browser-location.ts',
  },
  setupFilesAfterEnv: ['./config/jest/setupTests.ts'],
  moduleFileExtensions: [
    // Place tsx and ts to beginning as suggestion from Jest team
    // https://jestjs.io/docs/configuration#modulefileextensions-arraystring
    'tsx',
    'ts',
    'web.js',
    'js',
    'web.ts',
    'web.tsx',
    'json',
    'web.jsx',
    'jsx',
    'node',
  ],
  modulePaths: ['<rootDir>/src'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;
