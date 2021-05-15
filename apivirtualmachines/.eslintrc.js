module.exports = {
    extends: 'airbnb-base',
    rules: {
        'no-underscore-dangle': ['error', { allow: ['_id'] }],
        indent: ['error', 4],
    },
    ignorePatterns: ['temp.js', '**/vendor/*.js', 'www', 'database.test.js', 'test.index.js'],
};
