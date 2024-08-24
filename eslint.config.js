import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  ...tseslint.configs.recommended,
  pluginJs.configs.recommended,
  {
    ignores: ['dist/*', 'seed/*']
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: { globals: globals.node },
    rules: {
      'prefer-const': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn'
    }
  }
]
