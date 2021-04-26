// React
import React, { useEffect } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Utilities
import { useWizardLayoutStore } from 'utilities/store';
import { useResponsive } from 'utilities/hooks';

// Components
import Button from 'components/button';

// Icons
import { FiHeart } from 'react-icons/fi';

const WizardLayoutComponent = ({ children, pageProps }) => {
    // Store: wizardLayout
    const {
        rightMenuActive,
        toggleRightMenu,
        leftMenuActive,
        toggleLeftMenu,
    } = useWizardLayoutStore();

    // Hook: Get breakpoint
    const bp = useResponsive();

    // Effect: Listen to breakpoint and toggle menu accordingly
    useEffect(() => {
        if (['2xs', 'xs', 'sm', 'md', 'lg'].includes(bp)) {
            toggleLeftMenu(false);
            toggleRightMenu(false);
        }
        if (['xl', '2xl', '3xl'].includes(bp)) {
            toggleLeftMenu(true);
            toggleRightMenu(true);
        }
    }, [bp]);

    return (
        <>
            <div
                className={cc([
                    'fixed top-48 lg:top-64 sm:top-56 w-1/5 flex xl:w-1/5 3xl:w-[300px] bg-white transition-slow transform bottom-0 z-aside border-r border-gray-10 px-16 sm:px-24 lg:px-32',
                    {
                        'pointer-events-auto': leftMenuActive,
                        ' -translate-x-full pointer-events-none': !leftMenuActive,
                    },
                ])}>
                Aside TBD
            </div>

            <div
                className={cc([
                    'fixed right-0 bottom-0 top-0 w-1/4 flex bg-amber-10 lg:w-1/4 3xl:w-[400px] transition-slow transform z-aside p-20 sm:p-24',
                    {
                        'pointer-events-auto': rightMenuActive,
                        'translate-x-full pointer-events-none': !rightMenuActive,
                    },
                ])}>
                Help TBD
            </div>

            <div
                className={cc([
                    'absolute top-48 lg:top-64 sm:top-56 flex justify-center transition-slow left-0 right-0 mb-24',
                    {
                        'xl:left-[20%] 3xl:left-[300px]': leftMenuActive,
                        'lg:right-[25%] 3xl:right-[400px]': rightMenuActive,
                    },
                ])}>
                <div className="w-full transition-slow max-w-[600px]">
                    {children}
                    <button onClick={() => toggleLeftMenu(!leftMenuActive)}>
                        Toggle Left
                    </button>
                    <button onClick={() => toggleRightMenu(!rightMenuActive)}>
                        Toggle Right
                    </button>
                    <div className="py-16"></div>
                    <Button size="small" action={() => {}} icon={FiHeart}>
                        Button button
                    </Button>
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
