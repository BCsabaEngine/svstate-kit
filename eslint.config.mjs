import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier/flat';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import svelte from 'eslint-plugin-svelte';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import svelteSslintParser from 'svelte-eslint-parser';
import tseslint from 'typescript-eslint';

export default [
	{
		ignores: [
			'*.cjs',
			'**/.DS_Store',
			'**/node_modules',
			'build',
			'.svelte-kit',
			'package',
			'**/.env',
			'**/.env.*',
			'!**/.env.example',
			'src/icons',
			'plan/**/*.js',
			'**/pnpm-lock.yaml',
			'**/package-lock.json',
			'**/yarn.lock'
		]
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	...svelte.configs.recommended,
	unicorn.configs.all,
	prettierConfig,
	{
		plugins: {
			'simple-import-sort': simpleImportSort
		},

		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			},

			parser: tsParser,
			ecmaVersion: 2020,
			sourceType: 'module',

			parserOptions: {
				extraFileExtensions: ['.svelte']
			}
		},

		rules: {
			'@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
			curly: ['error', 'multi'],
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
			'svelte/require-each-key': 'off',
			'svelte/sort-attributes': 'error',
			'svelte/prefer-const': 'error',
			'svelte/no-unnecessary-state-wrap': 'off',
			'unicorn/filename-case': 'off',
			'unicorn/switch-case-braces': 'off',
			'unicorn/no-document-cookie': 'off',
			'unicorn/no-nested-ternary': 'off',
			'unicorn/no-await-expression-member': 'off',
			'unicorn/no-array-reduce': 'off',
			'unicorn/prefer-global-this': 'off',
			'no-alert': 'error',
			'no-console': 'error',
			'no-debugger': 'error'
		}
	},
	{
		files: ['**/*.svelte'],

		languageOptions: {
			parser: svelteSslintParser,
			ecmaVersion: 2020,
			sourceType: 'module',

			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		},

		rules: {
			curly: ['error', 'multi'],
			'no-alert': 'error',
			'no-console': 'error',
			'no-debugger': 'error'
		}
	}
];
