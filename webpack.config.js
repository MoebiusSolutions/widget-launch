var path = require('path');
var CopyPlugin = require('copy-webpack-plugin');

module.exports = function (env, argv) {
    return {
        entry: './src/index.ts',
        output: {
            clean: true,
            library: {
                name: {
                    amd: '@moesol/widget-launch',
                    commonjs: '@moesol/widget-launch',
                },
                type: 'umd',
            },
            filename: 'index.js',
            path: path.resolve(__dirname, 'build'),
        },

        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },

        module: {
            rules: [
                {
                    test: /\.(ts|js)x?$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                },
            ],
        },

        plugins: [
            new CopyPlugin({
                patterns: [
                    {
                        from: 'dist/index.d.ts',
                        to: '[name][ext]',
                    },
                ],
            }),
        ],
    };
};
