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
            // Create Initiative Wizard
            {
                source: '/create/introduction/:rest*',
                destination: '/create/new/introduction/:rest*',
            },
            {
                source: '/create/:rest*',
                destination: '/wizard/:rest*',
            },

            // Initiative Wizard
            {
                source: '/initiative/:inititiativeId/:page',
                destination:
                    '/wizard/:inititiativeId/:page?initiativeId=:inititiativeId',
            },

            // Update Initiative
            {
                source: '/initiative/:inititiativeId/:page/update',
                destination:
                    '/wizard/:inititiativeId/:page?initiativeId=:inititiativeId&update=true',
            },

            // Report Wizard
            {
                source: '/report/:inititiativeId/:page/:reportId',
                destination:
                    '/wizard/:inititiativeId/:page?reportId=:reportId&initiativeId=:inititiativeId',
            },

            // Update Report
            {
                source: '/report/:inititiativeId/:page/:reportId/update',
                destination:
                    '/wizard/:inititiativeId/:page?reportId=:reportId&initiativeId=:inititiativeId&update=true',
            },

            // Normal pages
            {
                source: '/:inititiativeId/:rest*',
                destination:
                    '/:inititiativeId/:rest*?initiativeId=:inititiativeId',
            },
        ];
    },
};
