module.exports = {
	env: {
		commonjs: true,
		es2021: true,
		node: true,
	},
	extends: 'xo',
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script',
			},
		},
		{
			extends: ['xo-typescript'],
			files: ['*.ts', '*.tsx'],
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
	},
	rules: {
		'@typescript-eslint/consistent-type-definitions': 'false',
	},
};
