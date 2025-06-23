module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.js$': 'babel-jest',
    '^.+\\.ts$': 'babel-jest', // Assuming we might use TS in scripts or tests
  },
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,vue,ts}',
    '!src/main.ts', // No need to cover entry point
    '!src/router/index.ts', // No router index.ts currently
    '!src/services/roadmapService.ts', // Covered by other means or future backend tests
    // Add other exclusions as needed, e.g., theme files, design tokens
    '!src/design/**',
    '!src/design-system/**',
    '!src/theme/**',
    '!src/styles/**'
  ],
  coverageReporters: ['html', 'text', 'text-summary', 'clover'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
