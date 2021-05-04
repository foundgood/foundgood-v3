// React
import React from 'react';

// Packages
import Head from 'next/head';
import t from 'prop-types';

// Utilities

// Components

const BlankLayoutComponent = ({ children, pageProps }) => {
    return (
        <div className="absolute left-0 right-0 flex justify-center mb-24 transition-slow top-48 xl:top-0 sm:top-56">
            <div className="w-full transition-slow max-w-[700px] page-mx mt-80 pb-64 lg:pb-96">
                {children}
            </div>
        </div>
    );
};

BlankLayoutComponent.propTypes = {
    pageProps: t.object,
};

BlankLayoutComponent.defaultProps = {
    pageProps: {},
};

export default BlankLayoutComponent;
