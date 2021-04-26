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
    target: 'serverless',
};
