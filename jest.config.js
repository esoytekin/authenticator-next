const nextJest = require('next/jest');
const createJestConfig = nextJest({
    dir: './',
});
const customJestConfig = {
    moduleDirectories: ['node_modules', '<rootDir>/'],
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['./setupTests.tsx'],
};
module.exports = createJestConfig(customJestConfig);
