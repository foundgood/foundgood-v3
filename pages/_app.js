import React, { useEffect } from 'react';

// Next
import Head from 'next/head';
import { useRouter } from 'next/router';

// Packages and polyfills
import { Transition, animated } from 'react-spring';

// Style
import 'styles/foundgood.css';

// Utilities

// Components
import LayoutWrapper from 'components/_layout/layoutWrapper';

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Foundgood</title>
                <link rel="icon" href="/favicon.ico" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <Transition
                items={{
                    id: router.route,
                    Component,
                    pageProps,
                }}
                keys={item => item.id}
                from={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                enter={{ opacity: 1 }}
                leave={{ opacity: 0, position: 'absolute' }}>
                {(styles, { pageProps, Component }) => (
                    <animated.div style={{ ...styles, width: '100%' }}>
                        <LayoutWrapper
                            {...{ pageLayout: Component.layout, pageProps }}>
                            <Component {...{ pageProps }} />
                        </LayoutWrapper>
                    </animated.div>
                )}
            </Transition>
        </>
    );
}

export default MyApp;
