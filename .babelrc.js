module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: 'defaults',
                useBuiltIns: 'usage',
                corejs: 3,
            },
        ],
        '@babel/preset-typescript',
    ],
    plugins: ['@babel/plugin-proposal-class-properties'],
    env: {
        test: {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: 'maintained node versions',
                        useBuiltIns: 'usage',
                        corejs: 3,
                    },
                ],
            ],
        },
    },
};
