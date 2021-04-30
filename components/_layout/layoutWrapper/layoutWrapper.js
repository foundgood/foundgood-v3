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
import ReportLayout from 'components/_layout/reportLayout';
import InitiativeLayout from 'components/_layout/initiativeLayout';

// Layouts and their settings
const allLayouts = {
    default: {
        layout: DefaultLayout,
    },
    wizard: {
        layout: WizardLayout,
        headerUserControls: false,
    },
    initiative: {
        layout: InitiativeLayout,
    },
    report: {
        layout: ReportLayout,
    },
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
