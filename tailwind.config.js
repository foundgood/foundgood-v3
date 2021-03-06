const emInPx = px => `${px / 16}em`;
const remInPx = (num, name = false) => ({
    [name ? name : num]: `${num / 16}rem`,
});

module.exports = {
    mode: 'jit',
    purge: {
        options: {},
        content: [
            './components/**/*.{js,ts,jsx,tsx,md}',
            './utilities/**/*.{js,ts,jsx,tsx,md}',
            './pages/**/*.{js,ts,jsx,tsx}',
        ],
    },
    darkMode: false,
    theme: {
        debugScreens: {
            position: ['bottom', 'right'],
        },
        colors: {
            transparent: 'transparent',
            // Utility
            current: 'currentColor',
            white: '#ffffff',
            error: 'rgb(227, 40, 64)',
            // Theme colors
            blue: {
                300: 'hsl(231, 50%, 50%)',
                200: 'hsl(231, 92%, 67%)',
                120: 'hsl(231, 67%, 17%)',
                100: 'hsl(231, 50%, 33%)',
                80: 'hsl(231, 33%, 33%)',
                60: 'hsl(231, 25%, 50%)',
                40: 'hsl(231, 33%, 75%)',
                20: 'hsl(231, 33%, 92%)',
                10: 'hsl(231, 17%, 96%)',
            },
            teal: {
                300: 'hsl(203, 50%, 50%)',
                200: 'hsl(203, 92%, 67%)',
                120: 'hsl(203, 67%, 17%)',
                100: 'hsl(203, 50%, 33%)',
                80: 'hsl(203, 33%, 33%)',
                60: 'hsl(203, 25%, 50%)',
                40: 'hsl(203, 33%, 75%)',
                20: 'hsl(203, 33%, 92%)',
                10: 'hsl(203, 17%, 96%)',
            },
            coral: {
                300: 'hsl(6, 50%, 50%)',
                200: 'hsl(6, 92%, 67%)',
                120: 'hsl(6, 67%, 17%)',
                100: 'hsl(6, 50%, 33%)',
                80: 'hsl(6, 33%, 33%)',
                60: 'hsl(6, 25%, 50%)',
                40: 'hsl(6, 33%, 75%)',
                20: 'hsl(6, 33%, 92%)',
                10: 'hsl(6, 17%, 96%)',
            },
            amber: {
                300: 'hsl(34, 50%, 50%)',
                200: 'hsl(34, 92%, 67%)',
                120: 'hsl(34, 67%, 17%)',
                100: 'hsl(34, 50%, 33%)',
                80: 'hsl(34, 33%, 33%)',
                60: 'hsl(34, 25%, 50%)',
                40: 'hsl(34, 33%, 75%)',
                20: 'hsl(34, 33%, 92%)',
                10: 'hsl(34, 17%, 96%)',
            },
            gray: {
                10: '#F3F3F3',
            },
        },
        ringWidth: {
            0: '0px',
            2: '2px',
            3: '3px',
            4: '4px',
        },
        fontFamily: {
            heading: ['tt-commons'],
            body: ['tt-commons'],
        },
        fontSize: {
            ...remInPx(14),
            ...remInPx(16),
            ...remInPx(18),
            ...remInPx(18),
            ...remInPx(20),
            ...remInPx(20),
            ...remInPx(24),
            ...remInPx(28),
            ...remInPx(30),
            ...remInPx(32),
            ...remInPx(36),
            ...remInPx(40),
            ...remInPx(42),
            ...remInPx(48),
        },
        fontWeight: {
            normal: 400,
            medium: 500,
            bold: 600,
        },
        lineHeight: {
            tight: 1,
            normal: 1.3,
        },
        screens: {
            xs: emInPx(320),
            sm: emInPx(414),
            md: emInPx(768),
            lg: emInPx(1024),
            xl: emInPx(1200),
            '2xl': emInPx(1440),
            '3xl': emInPx(1600),
        },
        spacing: {
            0: 0,
            ...remInPx(1),
            ...remInPx(2),
            ...remInPx(3),
            ...remInPx(4),
            ...remInPx(5),
            ...remInPx(6),
            ...remInPx(7),
            ...remInPx(8),
            ...remInPx(10),
            ...remInPx(11),
            ...remInPx(12),
            ...remInPx(16),
            ...remInPx(17),
            ...remInPx(18),
            ...remInPx(19),
            ...remInPx(20),
            ...remInPx(24),
            ...remInPx(32),
            ...remInPx(36),
            ...remInPx(40),
            ...remInPx(46),
            ...remInPx(48),
            ...remInPx(56),
            ...remInPx(64),
            ...remInPx(76),
            ...remInPx(80),
            ...remInPx(96),
            ...remInPx(120),
            ...remInPx(128),
            ...remInPx(144),
            ...remInPx(160),
            ...remInPx(192),
            ...remInPx(208),
            ...remInPx(232),
            ...remInPx(264),
            '1/12': '8.333333%',
            '2/12': '16.666667%',
            '3/12': '25%',
            '4/12': '33.333333%',
            '5/12': '41.666667%',
            '6/12': '50%',
            '7/12': '58.333333%',
            '8/12': '66.666667%',
            '9/12': '75%',
            '10/12': '83.333333%',
            '11/12': '91.666667%',
            'screen-1/2': '50vw',
            screen: '100vw',
        },
        extend: {
            inset: {
                full: '100%',
                '1/2': '50%',
            },
            transitionTimingFunction: {
                'smooth-out': 'cubic-bezier(0.5, 0.035, 0.19, 1.0)',
            },
            zIndex: {
                below: '-1',
                above: '1',
                content: '30',
                header: '80',
                'below-aside': '85',
                aside: '90',
                logo: '100',
                help: '110',
                modal: '200',
            },
            borderRadius: {
                ...remInPx(4),
                ...remInPx(8),
                ...remInPx(16),
            },
            screens: {
                print: { raw: 'print' },
            },
            keyframes: {
                'fade-in': {
                    '0%': {
                        opacity: 0,
                    },
                    '100%': {
                        opacity: 1,
                    },
                },
                'preloader-colors': {
                    '0%': {
                        color: '#ee6055',
                    },
                    '25%': {
                        color: '#60d394',
                    },
                    '50%': {
                        color: '#aaf683',
                    },
                    '75%': {
                        color: '#ffd97d',
                    },
                    '100%': {
                        color: '#ff9b85',
                    },
                },
            },
            animation: {
                'fade-in': 'fade-in 1s ease-out',
                'preloader-colors':
                    'preloader-colors 4s ease-out 0s infinite alternate',
            },
            // keyframes: {
            //     'preloader-colors-loop': {
            //         '0%': {
            //             color: '#ee6055',
            //         },
            //         '25%': {
            //             color: '#60d394',
            //         },
            //         '50%': {
            //             color: '#aaf683',
            //         },
            //         '75%': {
            //             color: '#ffd97d',
            //         },
            //         '100%': {
            //             color: '#ff9b85',
            //         },
            //     },
            // },
            // animation: {
            //     'preloader-colors-loop':
            //         'preloader-colors-loop 10s linear 0s infinite alternate',
            // },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('tailwindcss-debug-screens'),
    ],
};
