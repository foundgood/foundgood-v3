import React, { useEffect } from 'react';

// Next
import Head from 'next/head';

// Packages and polyfills

// Style
import 'styles/foundgood.css';

// Utilities
import { useAuth } from 'utilities/hooks';

// Components
import LayoutWrapper from 'components/_layout/layoutWrapper';

function MyApp({ Component, pageProps }) {
    // Hook: Initialize authentication
    const { initialize } = useAuth();
    initialize();

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
            <LayoutWrapper {...{ pageLayout: Component.layout, pageProps }}>
                <Component {...{ pageProps }} />
            </LayoutWrapper>
        </>
    );
}

export default MyApp;
