// .eslintrc.js
module.exports = {
	root: true,
	plugins: ['prettier'],
	extends: ['eslint:recommended', 'prettier', 'airbnb-base', 'plugin:prettier/recommended'],
	env: {
		node: true,
		es6: true,
	},
	rules: {
		'func-names': 0,
		'linebreak-style': 0,
		'no-undef': 0,
		'prefer-arrow-callback': 2,
		'arrow-body-style': ['error', 'always'],
		'id-length': ['error'],
	},
	ignorePatterns: [
		'node_modules/',
		'src/AFC/',
		'src/Assets/',
		'/src/Bridge/',
		'/src/Font/',
		'/src/FrameWork/',
		'/src/IOTester/',
		'/src/LIB/',
	],
};
