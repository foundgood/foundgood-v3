import React, { useEffect } from 'react';

// Next
import Head from 'next/head';

// Packages and polyfills
import { useRouter } from 'next/router';

// Style
import 'styles/foundgood.css';

// Utilities
import { useAuth } from 'utilities/hooks';

// Components
import LayoutWrapper from 'components/_layout/layoutWrapper';

function MyApp({ Component, pageProps }) {
    // Hook: Authentication (true initializes the user using localstorage if preset)
    const { loggedIn, initialized } = useAuth(true);

    // Hook: Router
    const router = useRouter();

    // Effect: Handle routes if logged in or not
    useEffect(() => {
        if (initialized && !loggedIn) {
            router.push('/');
        }
    }, [loggedIn, initialized]);

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
