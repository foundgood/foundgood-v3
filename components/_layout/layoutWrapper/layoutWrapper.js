// React
import React from 'react';

// Packages
import Head from 'next/head';
import t from 'prop-types';
import { useRouter } from 'next/router';

// Utilities

// Components
import Header from 'components/_layout/header';
import DefaultLayout from 'components/_layout/defaultLayout';
import WizardLayout from 'components/_layout/wizardLayout';
import ReportLayout from 'components/_layout/reportLayout';
import InitiativeLayout from 'components/_layout/initiativeLayout';
import BlankLayout from 'components/_layout/blankLayout';

// Layouts and their settings
const allLayouts = {
    default() {
        return { layout: DefaultLayout };
    },
    wizard(update) {
        const updateLayout = update ? true : false;
        return {
            layout: WizardLayout,
            headerUserControls: false,
            layoutSettings: {
                aside: !updateLayout,
                help: true,
                updateBottom: updateLayout,
            },
        };
    },
    wizardBlank() {
        return {
            layout: WizardLayout,
            headerUserControls: false,
            layoutSettings: { aside: false, help: false },
        };
    },
    initiative() {
        return {
            layout: InitiativeLayout,
            layoutSettings: null,
        };
    },
    report() {
        return {
            layout: ReportLayout,
            layoutSettings: null,
        };
    },
    blank() {
        return {
            layout: BlankLayout,
            headerUserControls: false,
            layoutSettings: null,
        };
    },
};

const LayoutWrapperComponent = ({
    children,
    pageLayout = 'default',
    pageProps,
}) => {
    // Use router to get param "update"
    // Could be expanded later with other params
    const router = useRouter();

    // Get the layout based on component
    const Layout = allLayouts[pageLayout](router.query?.update ?? false);

    return (
        <>
            <Header showUserControls={Layout.headerUserControls} />
            <Layout.layout
                {...{ pageProps, layoutSettings: Layout.layoutSettings }}>
                {children}
            </Layout.layout>
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
