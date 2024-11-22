module.exports = {
    preset: 'jest-puppeteer',
    testMatch: [
      "<rootDir>/apps/extension/test/**/*.test.js", // Path to your tests
    ],
    testPathIgnorePatterns: [
      "/node_modules/",
    ],
    globals: {
      "ts-jest": {
        isolatedModules: true,
      },
    },
    transform: {
      "^.+\\.ts$": "ts-jest", // If you're using TypeScript, otherwise remove this
    },
    transformIgnorePatterns: [
        '/node_modules/(?!puppeteer|other-esm-modules)/', // Example of allowing ESM modules like Puppeteer
      ],
  };
  