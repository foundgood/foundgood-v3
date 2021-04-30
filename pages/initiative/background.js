// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useMetadata, useAuth } from 'utilities/hooks';

// Components

const BackgroundComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { label, valueSet, log } = useMetadata();

    return (
        <div className="flex flex-col">
            <h1 className="pr-56 t-h1">Background details</h1>
        </div>
    );
};

export async function getStaticProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    };
}

BackgroundComponent.propTypes = {
    pageProps: t.object,
};

BackgroundComponent.defaultProps = {
    pageProps: {},
};

BackgroundComponent.layout = 'initiative';

export default BackgroundComponent;
