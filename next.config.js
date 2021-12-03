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
        domains: [
            'foundgood-initiative-update-content-media.s3.amazonaws.com',
            'foundgood-initiative-update-content-media.s3.eu-west-1.amazonaws.com',
        ],
    },
    target: 'serverless',
    experimental: {
        scrollRestoration: true,
    },
    async rewrites() {
        return [
            {
                source: '/wizard/:inititiativeId/:page/update',
                destination:
                    '/wizard/:inititiativeId/:page?initiativeId=:inititiativeId&update=true',
            },
            {
                source: '/wizard/:inititiativeId/:page/:reportId',
                destination:
                    '/wizard/:inititiativeId/:page?reportId=:reportId&initiativeId=:inititiativeId',
            },
            {
                source: '/wizard/:inititiativeId/:page/:reportId/update',
                destination:
                    '/wizard/:inititiativeId/:page?reportId=:reportId&initiativeId=:inititiativeId&update=true',
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
