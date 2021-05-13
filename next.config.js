module.exports = {
    i18n: {
        locales: ['en', 'da'],
        defaultLocale: 'en',
        localeDetection: !process.env.NODE_ENV === 'development',
    },
    webpack(config) {
        // SVG support
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        return config;
    },
    images: {
        domains: ['foundgood-initiative-update-content-media.s3.amazonaws.com'],
    },
    target: 'serverless',
};
