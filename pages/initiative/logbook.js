// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useMetadata, useAuth } from 'utilities/hooks';

// Components

const LogbookComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { label, valueSet, log } = useMetadata();

    return <div className="t-h1">Logbook details</div>;
};

export async function getStaticProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    };
}

LogbookComponent.propTypes = {
    pageProps: t.object,
};

LogbookComponent.defaultProps = {
    pageProps: {},
};

LogbookComponent.layout = 'initiative';

export default LogbookComponent;
