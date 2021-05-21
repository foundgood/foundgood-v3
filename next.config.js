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
    async rewrites() {
        return [
            {
                source: '/wizard/:inititiativeId/:page/:reportId',
                destination:
                    '/wizard/:inititiativeId/:page?reportId=:reportId&initiativeId=:inititiativeId',
            },
            {
                source: '/wizard/introduction/:rest*',
                destination: '/wizard/new/introduction/:rest*',
            },
            {
                source: '/:inititiativeId/:rest*',
                destination:
                    '/:inititiativeId/:rest*?initiativeId=:inititiativeId',
            },
        ];
    },
};
