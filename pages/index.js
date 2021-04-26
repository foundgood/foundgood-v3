// React
import React from 'react';

// Packages
import t from 'prop-types';
import Link from 'next/link';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Components

const HomeComponent = ({ pageProps }) => {
    const { label, valueSet, log } = useMetadata();

    log();

    return (
        <div className="t-h1">
            <Link href="/wizard">Foundgood,</Link>{' '}
            {label('objects.initiative.Approach_Thinking__c')}
        </div>
    );
};

export async function getStaticProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    };
}

HomeComponent.propTypes = {
    pageProps: t.object,
};

HomeComponent.defaultProps = {
    pageProps: {},
};

export default HomeComponent;
