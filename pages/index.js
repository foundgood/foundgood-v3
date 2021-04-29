// React
import React, { useEffect } from 'react';

// Packages
import t from 'prop-types';
import Link from 'next/link';

// Utilities
import { useSalesForce, useAuth } from 'utilities/hooks';

// Components
import Button from 'components/button';

const HomeComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn, logout } = useAuth();
    verifyLoggedIn();

    const { sfQuery, queries } = useSalesForce();
    const { data, error } = sfQuery(queries.getObjectList.account());

    return (
        <div className="t-h1">
            <Link href="/wizard">Foundgood,</Link>
            <Button theme="amber" action={() => logout()}>
                Logout
            </Button>
            <div className="flex flex-col w-full px-32 mt-32">
                <h1 className="t-h3">
                    Data from the server (only after login)
                </h1>
                {data?.data?.records.length > 0 &&
                    data.data.records.map(item => (
                        <p
                            key={item.Id}
                            className="flex justify-between t-body">
                            <span>{item.Name}</span>
                            <span>{item.Translated_Location__c}</span>
                        </p>
                    ))}
            </div>
        </div>
    );
};

HomeComponent.propTypes = {
    pageProps: t.object,
};

HomeComponent.defaultProps = {
    pageProps: {},
};

export default HomeComponent;
