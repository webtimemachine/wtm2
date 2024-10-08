const config = {
  rootDir: 'src',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
    // process `*.tsx` files with `ts-jest`
  },
  moduleNameMapper: {
    // '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/config/jest/fileMock.ts',
    // '^.+\\.(css|less|scss|sass)$': '<rootDir>/config/jest/styleMock.ts',
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
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/utils/'],
};

export default config;
