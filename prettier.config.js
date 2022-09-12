module.exports = {
	printWidth: 500,
	tabWidth: 2,
	useTabs: true,
	semi: true,
	singleQuote: true,
	trailingComma: 'all', // other options `es5` or `all`
	bracketSpacing: true,
	arrowParens: 'always', // other option 'always'
	parser: 'typescript',
	overrides: [
		{
			files: '*.html',
			options: {
				parser: 'angular',
			},
		},
	],
};
