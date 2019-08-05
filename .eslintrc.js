module.exports = {
  'env': {
    'commonjs': true,
    'es6': true,
    'node': true,
    'jest': true
  },
  "extends": "airbnb-base",
  'rules': {
    'semi': [
      'error',
      'never'
    ],
    'arrow-parens': [
      'error',
      'as-needed'
    ],
    'no-underscore-dangle': [
      'error', 
      { 
        'allow': [ '_id', '__v' ] 
      }
    ],
    'prefer-destructuring': [
      'error', 
      {
        'array': true,
        'object': true
      }, 
      {
        'enforceForRenamedProperties': false
      }
    ],
    'comma-dangle': [
      'error',
      'never'
    ],
    'no-console': 0
  }
};