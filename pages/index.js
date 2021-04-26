// React
import React from 'react';

// Packages
import t from 'prop-types';
import Link from 'next/link';

// Utilities
import { useMetadata, useAuth } from 'utilities/hooks';

// Components
import Button from 'components/button';

const HomeComponent = ({ pageProps }) => {
    const { label } = useMetadata();
    const { login, logout } = useAuth();

    return (
        <div className="t-h1">
            <Link href="/wizard">Foundgood,</Link>{' '}
            {label('objects.initiative.Approach_Thinking__c')}
            <div className="flex px-32 mt-32 space-x-32">
                <Button action={() => login()}>Login</Button>
                <Button theme="amber" action={() => logout()}>
                    Logout
                </Button>
            </div>
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
