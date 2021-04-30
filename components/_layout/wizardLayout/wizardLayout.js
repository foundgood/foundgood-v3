// React
import React, { useEffect } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Utilities
import { useWizardLayoutStore } from 'utilities/store';
import { useResponsive, useMetadata } from 'utilities/hooks';

// Components
import IconButton from 'components/iconButton';
import Button from 'components/button';
import BottomNavigation from 'components/_wizard/bottomNavigation';
import AsideNavigation from 'components/_wizard/asideNavigation';

// Icons
import { FiAlignLeft, FiChevronsLeft } from 'react-icons/fi';

const WizardLayoutComponent = ({ children, pageProps }) => {
    // Store: wizardLayout
    const {
        rightMenuActive,
        toggleRightMenu,
        leftMenuActive,
        toggleLeftMenu,
    } = useWizardLayoutStore();

    // Hook: Metadata
    const { labelTodo } = useMetadata();

    // Hook: Get breakpoint
    const bp = useResponsive();

    // Effect: Listen to breakpoint and toggle menu accordingly
    const smallBps = ['2xs', 'xs', 'sm', 'md', 'lg'];
    const largeBps = ['xl', '2xl', '3xl'];
    useEffect(() => {
        if (smallBps.includes(bp)) {
            toggleLeftMenu(false);
            toggleRightMenu(false);
        }
        if (largeBps.includes(bp)) {
            toggleLeftMenu(true);
            toggleRightMenu(true);
        }
    }, [bp]);

    return (
        <>
            {/* Aside wrapper */}
            <div
                style={{ willChange: 'transform' }}
                className={cc([
                    'fixed flex-col header-t w-[300px] max-w-full xl:w-1/5 flex 3xl:w-[300px] bg-white transition-slow transform bottom-0 z-aside border-r border-teal-10 page-px',
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
                    'fixed flex-col right-0 bottom-0 top-0 w-[400px] max-w-full xl:w-1/4 flex bg-amber-10 3xl:w-[400px] transition-slow transform z-aside p-20 sm:p-24',
                    {
                        'pointer-events-auto': rightMenuActive,
                        'translate-x-full pointer-events-none': !rightMenuActive,
                    },
                ])}>
                <Button
                    variant="tertiary"
                    className="self-end"
                    action={() => {
                        toggleRightMenu(false);
                    }}>
                    {labelTodo('Close')}
                </Button>
                {/* Help content */}
                <div className="mt-32 overflow-y-auto scrolling-touch">
                    Help content
                </div>
            </div>

            {/* Button navigation */}
            <div className="fixed left-0 right-0 flex justify-between py-8 bg-white transition-default xl:bg-transparent xl:justify-end header-t page-px z-below-aside">
                <IconButton
                    icon={FiAlignLeft}
                    className="self-start my-8 xl:hidden"
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

                <Button
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
                    {labelTodo('Help')}
                </Button>
            </div>

            {/* Content wrapper for aligning */}
            <div
                style={{ willChange: 'left, right' }}
                className={cc([
                    'absolute flex justify-center transition-slow left-0 right-0 mb-24 top-48 xl:top-0 sm:top-56',
                    {
                        'xl:left-[20%] 3xl:left-[300px]': leftMenuActive,
                        'xl:right-[25%] 3xl:right-[400px]': rightMenuActive,
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
                            'xl:left-[20%] 3xl:left-[300px]': leftMenuActive,
                            'xl:right-[25%] 3xl:right-[400px]': rightMenuActive,
                        },
                    ])}>
                    <BottomNavigation />
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
