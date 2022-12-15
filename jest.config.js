module.exports = {
  verbose: false,
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tests/tsconfig.test.json' }],
  },
  moduleNameMapper: {
    axios: 'axios/dist/node/axios.cjs',
  },
  testTimeout: 30000,
  setupFiles: [],
  setupFilesAfterEnv: [],
  testEnvironment: 'jsdom',
}
