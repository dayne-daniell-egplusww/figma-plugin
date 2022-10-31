module.exports = {
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  transform: {
    '.*\\.(vue)$': 'vue-jest',
    '^.+\\.js$': 'babel-jest',
    '^.+\\.ts$': 'babel-jest',
    '^.+\\.(gql|graphql)$': 'jest-transform-graphql',
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|svg|css)$': '<rootDir>/tests/__mocks__/file_mock.js',
    '^~(.*)$': '<rootDir>/src$1',
  },
};
