// React
import React, { useEffect } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Utilities
import { useInitiativeLayoutStore } from 'utilities/store';
import { useResponsive, useMetadata } from 'utilities/hooks';

// Components
import ActiveLink from 'components/activeLink';
import IconButton from 'components/iconButton';

// Icons
import { FiAlignRight, FiChevronsRight } from 'react-icons/fi';

const InitiativeLayoutComponent = ({ children, pageProps }) => {
    // Store: InitiativeLayout
    const {
        mobileMenuActive,
        toggleMobileMenu,
        navigation,
    } = useInitiativeLayoutStore();

    // Hook: Metadata
    const { labelTodo } = useMetadata();

    // Hook: Get breakpoint
    const bp = useResponsive();

    // Effect: Listen to breakpoint and toggle menu accordingly
    const largeBps = ['md', 'lg', 'xl', '2xl', '3xl'];
    useEffect(() => {
        if (largeBps.includes(bp)) {
            toggleMobileMenu(false);
        }
    }, [bp]);

    return (
        <>
            <div className="fixed inset-0 bg-amber-10"></div>

            {/* Initiative title and initiative navigation wrapper */}
            <div className="fixed left-0 right-0 flex flex-col header-t z-below-aside">
                {/* Iniative title */}
                <div className="flex items-center justify-start py-16 bg-blue-20 page-px">
                    <p className="t-sh5 text-blue-60 md:flex line-clamp-3">
                        {labelTodo(
                            'Coastal Hazard Wheel: Global coastal disaster prevention & recovery project'
                        )}
                    </p>
                </div>

                {/* Initiative navigation */}
                <div className="items-center justify-end hidden space-x-32 md:flex page-px bg-amber-10">
                    {navigation.map((item, index) => (
                        <ActiveLink
                            href={item.href}
                            key={index}
                            active="text-blue-100 !border-blue-100">
                            <a className="flex items-center h-56 text-blue-300 border-t-2 border-amber-10 t-h6 transition-default hover:text-blue-100">
                                {item.label}
                            </a>
                        </ActiveLink>
                    ))}
                </div>
            </div>

            {/* Mobile navigation */}
            <div className="absolute left-0 right-0 flex justify-end top-160 md:hidden page-px z-above">
                <IconButton
                    icon={FiAlignRight}
                    action={() => toggleMobileMenu(true)}
                    className="self-end my-8"
                />
                <div
                    className={cc([
                        'absolute top-0 -mt-8 mr-12 right-0 flex flex-col p-16 pb-24 bg-blue-20 rounded-8 transform transition-default',
                        {
                            'opacity-100 translate-x-0 pointer-events-auto': mobileMenuActive,
                            'opacity-0 translate-x-10 pointer-events-none': !mobileMenuActive,
                        },
                    ])}>
                    <IconButton
                        icon={FiChevronsRight}
                        iconType="stroke"
                        action={() => toggleMobileMenu(false)}
                        className="self-end mb-24 -mr-4"
                    />
                    <div className="flex flex-col pr-48 space-y-24">
                        {navigation.map((item, index) => (
                            <ActiveLink
                                href={item.href}
                                key={index}
                                active="text-blue-100">
                                <a
                                    onClick={() => {
                                        toggleMobileMenu(false);
                                    }}
                                    className="flex items-center text-blue-300 t-h6 transition-default hover:text-blue-100">
                                    {item.label}
                                </a>
                            </ActiveLink>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content wrapper */}
            <div
                className={cc([
                    'absolute flex h-full justify-center left-0 right-0',
                ])}>
                {/* Content */}
                <div className="w-full max-w-[900px] page-mx mt-160 md:mt-232 pb-64 lg:pb-96 rounded-8">
                    {children}
                </div>
            </div>
        </>
    );
};

InitiativeLayoutComponent.propTypes = {
    pageProps: t.object,
};

InitiativeLayoutComponent.defaultProps = {
    pageProps: {},
};

export default InitiativeLayoutComponent;
