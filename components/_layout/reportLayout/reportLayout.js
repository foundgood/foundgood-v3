// React
import React, { useEffect } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Utilities
import { useReportLayoutStore } from 'utilities/store';
import { useResponsive, useMetadata, useContext } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WizardStatus from 'components/_report/wizardStatus';
import AsideNavigation from 'components/_report/asideNavigation';
import IconButton from 'components/iconButton';
import Button from 'components/button';
import Footer from 'components/_layout/footer';

// Icons
import { FiAlignLeft, FiChevronsLeft } from 'react-icons/fi';

const ReportLayoutComponent = ({ children, pageProps }) => {
    // Store: ReportLayout
    const { leftMenuActive, toggleLeftMenu } = useReportLayoutStore();
    const { populateInitiative } = useInitiativeDataStore();

    // Hook: Metadata
    const { labelTodo } = useMetadata();

    // Hook: Context
    const { INITIATIVE_ID } = useContext();

    // Hook: Get breakpoint
    const bp = useResponsive();

    useEffect(() => {
        populateInitiative(INITIATIVE_ID);
    }, [INITIATIVE_ID]);

    // Effect: Listen to breakpoint and toggle menu accordingly
    const smallBps = ['2xs', 'xs', 'sm', 'md', 'lg'];
    const largeBps = ['xl', '2xl', '3xl'];
    useEffect(() => {
        if (smallBps.includes(bp)) {
            toggleLeftMenu(false);
        }
        if (largeBps.includes(bp)) {
            toggleLeftMenu(true);
        }
    }, [bp]);

    return (
        <>
            <div className="fixed inset-0 bg-amber-10"></div>
            {/* Aside wrapper */}
            <div
                style={{ willChange: 'transform' }}
                className={cc([
                    'fixed flex-col h-screen header-pt w-[300px] max-w-full xl:w-1/5 flex 3xl:w-[300px] bg-white transition-slow transform bottom-0 z-aside border-r border-teal-10 page-px',
                    {
                        'pointer-events-auto': leftMenuActive,
                        ' -translate-x-full pointer-events-none': !leftMenuActive,
                    },
                ])}>
                {/* Aside navigation wrapper */}
                <div className="flex py-8">
                    <IconButton
                        className="self-start my-8 xl:hidden"
                        icon={FiChevronsLeft}
                        iconType="stroke"
                        action={() => toggleLeftMenu(false)}
                    />
                    <Button
                        variant="secondary"
                        className="self-start hidden xl:flex"
                        action={`/${INITIATIVE_ID}/reports`}>
                        {labelTodo('Back to reports')}
                    </Button>
                </div>

                {/* Aside content */}
                <div className="flex-grow mt-32 overflow-y-auto scrolling-touch">
                    <AsideNavigation />
                </div>
            </div>

            {/* Button navigation and wizard status wrapper */}
            <div className="fixed left-0 right-0 flex flex-col header-t z-below-aside">
                {/* Button navigation */}
                <div className="flex items-center py-8 space-x-16 bg-white page-px xl:hidden">
                    <IconButton
                        icon={FiAlignLeft}
                        action={() => toggleLeftMenu(true)}
                    />
                    <Button variant="secondary">
                        {labelTodo('Back to reports')}
                    </Button>
                </div>
                {/* Wizard status */}
                <WizardStatus />
            </div>

            {/* Content wrapper for aligning */}
            <div
                style={{ willChange: 'left' }}
                className={cc([
                    'absolute flex justify-center transition-slow left-0 right-0 mb-24',
                    {
                        'xl:left-[20%] 3xl:left-[300px]': leftMenuActive,
                    },
                ])}>
                {/* Content */}
                <div className="w-full bg-white transition-slow max-w-[900px] page-mx mt-264 xl:mt-192 rounded-8">
                    {children}
                    <Footer />
                </div>
            </div>
        </>
    );
};

ReportLayoutComponent.propTypes = {
    pageProps: t.object,
};

ReportLayoutComponent.defaultProps = {
    pageProps: {},
};

export default ReportLayoutComponent;
