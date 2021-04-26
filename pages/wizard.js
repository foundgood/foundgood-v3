// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Components

const WizardComponent = ({ pageProps }) => {
    const { label, valueSet, log } = useMetadata();

    return (
        <div className="t-h1">
            Foundgood, {label('objects.initiative.Approach_Thinking__c')}
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
