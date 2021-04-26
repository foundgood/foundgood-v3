// React
import React from 'react';

// Packages
import Head from 'next/head';
import t from 'prop-types';

// Utilities

// Components

const DefaultLayoutComponent = ({ children, pageProps }) => {
    return <>{children}</>;
};

DefaultLayoutComponent.propTypes = {
    pageProps: t.object,
};

DefaultLayoutComponent.defaultProps = {
    pageProps: {},
};

export default DefaultLayoutComponent;
