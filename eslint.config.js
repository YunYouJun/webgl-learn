import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      '**/ref',
      '**/packages/lib',
    ],
  },
  {
    rules: {
      'no-alert': 'off',
    },
  },
)
