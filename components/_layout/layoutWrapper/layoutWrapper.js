// React
import React from 'react';

// Packages
import Head from 'next/head';
import t from 'prop-types';

// Utilities

// Components
import Header from 'components/_layout/header';
import DefaultLayout from 'components/_layout/defaultLayout';
import WizardLayout from 'components/_layout/wizardLayout';

// Layouts and their settings
const allLayouts = {
    default: DefaultLayout,
    wizard: {
        layout: WizardLayout,
        headerUserControls: false,
    },
    content: 'ContentLayout',
    report: 'ReportLayout',
};

const LayoutWrapperComponent = ({
    children,
    pageLayout = 'default',
    pageProps,
}) => {
    // Get the layout based on component
    const Layout = allLayouts[pageLayout];

    return (
        <>
            <Header showUserControls={Layout.headerUserControls} />
            <Layout.layout {...{ pageProps }}>{children}</Layout.layout>
        </>
    );
};

LayoutWrapperComponent.propTypes = {
    pageProps: t.object,
};

LayoutWrapperComponent.defaultProps = {
    pageProps: {},
};

export default LayoutWrapperComponent;
