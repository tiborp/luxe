/**
 * Exports the PostCSS configuration.
 */
module.exports = ({ file, options, env }) => ({
	plugins: {
		'postcss-import': {},
		'postcss-cssnext': {
			features: {
				rem: false
			}
		},
		autoprefixer: env === 'production',
		cssnano: env === 'production'
	}
});
