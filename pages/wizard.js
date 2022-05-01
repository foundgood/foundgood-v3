// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useLabels, useAuth } from 'utilities/hooks';

// Components

const WizardComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn, logout } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { label, valueSet, log } = useLabels();

    return (
        <div className="t-h1">
            Foundgood, {label('objects.Initiative__c.Approach_Thinking__c')}
        </div>
    );
};

export async function getStaticProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    };
}

WizardComponent.propTypes = {
    pageProps: t.object,
};

WizardComponent.defaultProps = {
    pageProps: {},
};

WizardComponent.layout = 'wizard';

export default WizardComponent;
