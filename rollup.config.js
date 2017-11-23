import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

import pkg from './package.json';

const external = [
	'reselect'
];

export default [
	{
		input: 'src/main.js',
		external,
		globals: {
			reselect: 'Reselect'
		},
		output: [{
			file: pkg.browser,
			format: 'umd'
		}],
		name: 'ReduxReselectValidation',
		plugins: [
			babel({
				exclude: 'node_modules/**',
			}),
			resolve(),
			commonjs()
		],
	},

	{
		input: 'src/main.js',
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		],
		external,
		plugins: [
			babel({
				exclude: 'node_modules/**',
			})
		],
	}
];
