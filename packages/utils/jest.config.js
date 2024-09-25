const baseConfig = require('../../jest.config.base.js');

module.exports = {
  ...baseConfig,
  name: '@wtm/utils',
  displayName: 'Utils',
  testEnvironment: 'jsdom',
  rootDir: '.',
  roots: ['<rootDir>/src'],
};
