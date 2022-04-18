module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/app'],
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
