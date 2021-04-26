import React from 'react';

// Next
import Head from 'next/head';

// Packages and polyfills

// Style
import 'styles/foundgood.css';

// Utilities

// Components
import LayoutWrapper from 'components/_layout/layoutWrapper';

function MyApp({ Component, pageProps }) {
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
