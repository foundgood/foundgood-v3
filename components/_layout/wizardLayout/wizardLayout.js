// React
import React, { useEffect } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { useRouter } from 'next/router';

// Utilities
import {
    useWizardLayoutStore,
    useInitiativeDataStore,
    useWizardNavigationStore,
} from 'utilities/store';
import { useResponsive, useLabels, useContext } from 'utilities/hooks';

// Components
import IconButton from 'components/iconButton';
import Button from 'components/button';
import UpdateBottomNavigation from 'components/_wizard/updateBottomNavigation';
import BottomNavigation from 'components/_wizard/bottomNavigation';
import { AsideNavigation } from 'components/_wizard/asideNavigation';
import AsideHelp from 'components/_wizard/asideHelp';

// Icons
import { FiAlignLeft, FiChevronsLeft } from 'react-icons/fi';

const WizardLayoutComponent = ({ children, layoutSettings }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const {
        rightMenuActive,
        toggleRightMenu,
        leftMenuActive,
        toggleLeftMenu,
    } = useWizardLayoutStore();
    const {
        onUrlOrContextChange,
        buildWizardItems,
        items,
    } = useWizardNavigationStore();
    const { utilities, populateInitiative } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const router = useRouter();
    const { MODE, CONTEXTS, REPORT_ID, INITIATIVE_ID } = useContext();
    const { label } = useLabels();
    const bp = useResponsive();

    // ///////////////////
    // DATA
    // ///////////////////

    const smallBps = ['2xs', 'xs', 'sm', 'md', 'lg'];
    const largeBps = ['xl', '2xl', '3xl'];

    // ///////////////////
    // EFFECTS
    // ///////////////////

    // Listen to breakpoint and toggle menu accordingly
    useEffect(() => {
        if (smallBps.includes(bp)) {
            toggleLeftMenu(false);
            toggleRightMenu(false);
        }
        if (largeBps.includes(bp)) {
            toggleLeftMenu(true);
            toggleRightMenu(false);
        }
    }, [bp]);

    // Fill report with data
    useEffect(() => {
        switch (MODE) {
            case CONTEXTS.CREATE:
            case CONTEXTS.INITIATIVE:
                // Initiative mode - check to populate initiative
                if (INITIATIVE_ID && INITIATIVE_ID !== 'new') {
                    populateInitiative(INITIATIVE_ID);
                }
                break;

            case CONTEXTS.REPORT:
                // Report mode - check to populate both report and initiative
                if (REPORT_ID && INITIATIVE_ID) {
                    populateInitiative(INITIATIVE_ID);
                }
                break;
        }
    }, [MODE, REPORT_ID, INITIATIVE_ID]);

    // Update wizard navigation items
    useEffect(() => {
        let type;
        switch (MODE) {
            case CONTEXTS.REPORT:
                type = utilities.reports.get(REPORT_ID).Report_Type__c;
                break;

            case CONTEXTS.INITIATIVE:
                // Fallback to default type "Reporting"
                type =
                    utilities.initiative.get().Configuration_Type__c ||
                    'Reporting';
                break;
            case CONTEXTS.CREATE:
                // Default type
                type = 'default';
                break;
        }

        buildWizardItems(MODE, type);
    }, [
        MODE,
        utilities.initiative.get().Configuration_Type__c,
        utilities.reports.get(REPORT_ID).Report_Type__c,
    ]);

    // Handle path change
    useEffect(() => {
        setTimeout(() => {
            const splitRoute = router.pathname.split('/');
            onUrlOrContextChange(splitRoute[splitRoute.length - 1]);
        }, 50);
    }, [router.asPath, items]);

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <>
            {/* Aside wrapper */}
            <div
                style={{ willChange: 'transform' }}
                className={cc([
                    'fixed flex-col h-screen w-[300px] max-w-full xl:w-1/5 flex 3xl:w-[300px] bg-white transition-slow transform bottom-0 z-help border-r border-teal-10 page-px header-pt',
                    {
                        'pointer-events-auto': leftMenuActive,
                        ' -translate-x-full pointer-events-none': !leftMenuActive,
                        '!hidden': !layoutSettings.aside,
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
                </div>

                {/* Aside content */}
                <div className="flex-grow mt-32 overflow-y-auto scrolling-touch">
                    <AsideNavigation />
                </div>
            </div>

            {/* Help wrapper */}
            <div
                style={{ willChange: 'transform' }}
                className={cc([
                    'fixed flex-col right-0 bottom-0 top-0 w-[400px] max-w-full xl:w-1/4 flex bg-amber-10 3xl:w-[400px] transition-slow transform z-help p-20 sm:p-24',
                    {
                        'pointer-events-auto': rightMenuActive,
                        'translate-x-full pointer-events-none': !rightMenuActive,
                        '!hidden': !layoutSettings.help,
                    },
                ])}>
                <Button
                    variant="tertiary"
                    className="self-end"
                    action={() => {
                        toggleRightMenu(false);
                    }}>
                    {label('ButtonCloseHelp')}
                </Button>
                {/* Help content */}
                <div className="mt-32 overflow-y-auto scrolling-touch">
                    <AsideHelp />
                </div>
            </div>

            {/* Button navigation */}
            <div className="fixed left-0 right-0 flex justify-between py-8 bg-white pointer-events-none transition-default xl:bg-transparent xl:justify-end header-t page-px z-below-aside">
                {layoutSettings.aside && (
                    <IconButton
                        icon={FiAlignLeft}
                        className="self-start my-8 pointer-events-auto xl:hidden"
                        action={() => {
                            if (smallBps.includes(bp)) {
                                toggleLeftMenu(true);
                                toggleRightMenu(false);
                            }
                            if (largeBps.includes(bp)) {
                                toggleLeftMenu(true);
                            }
                        }}
                    />
                )}

                {layoutSettings.help && (
                    <Button
                        className="pointer-events-auto"
                        variant="secondary"
                        action={() => {
                            if (smallBps.includes(bp)) {
                                toggleLeftMenu(false);
                                toggleRightMenu(true);
                            }
                            if (largeBps.includes(bp)) {
                                toggleRightMenu(true);
                            }
                        }}>
                        {label('ButtonHelp')}
                    </Button>
                )}
            </div>

            {/* Content wrapper for aligning */}
            <div
                style={{ willChange: 'left, right' }}
                className={cc([
                    'absolute flex justify-center transition-slow left-0 right-0 mb-24 top-48 xl:top-0 sm:top-56',
                    {
                        'xl:left-[20%] 3xl:left-[300px]':
                            leftMenuActive && layoutSettings.aside,
                        'xl:right-[25%] 3xl:right-[400px]':
                            rightMenuActive && layoutSettings.help,
                    },
                ])}>
                {/* Content */}
                <div className="w-full transition-slow max-w-[600px] page-mx mt-80 pb-64 lg:pb-96">
                    {children}
                </div>

                {/* Bottom bar wrapper for aligning */}
                <div
                    style={{ willChange: 'left, right' }}
                    className={cc([
                        'fixed bottom-0 left-0 right-0 h-48 lg:h-64 flex justify-center transition-slow z-below-aside',
                        {
                            'xl:left-[20%] 3xl:left-[300px]':
                                leftMenuActive && layoutSettings.aside,
                            'xl:right-[25%] 3xl:right-[400px]':
                                rightMenuActive && layoutSettings.help,
                        },
                    ])}>
                    {layoutSettings.updateBottom ? (
                        <UpdateBottomNavigation />
                    ) : (
                        <BottomNavigation />
                    )}
                </div>
            </div>
        </>
    );
};

WizardLayoutComponent.propTypes = {
    pageProps: t.object,
};

WizardLayoutComponent.defaultProps = {
    pageProps: {},
};

export default WizardLayoutComponent;
