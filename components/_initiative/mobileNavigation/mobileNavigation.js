// React
import React, { useEffect, useRef } from 'react';

// Packages
import cc from 'classcat';

// Utilities
import { useInitiativeLayoutStore } from 'utilities/store';
import { useResponsive } from 'utilities/hooks';

// Components
import ActiveLink from 'components/activeLink';
import IconButton from 'components/iconButton';

// Icons
import { FiAlignRight, FiChevronsRight } from 'react-icons/fi';

const MobileNavigationComponent = () => {
    // Store: InitiativeLayout
    const {
        mobileMenuActive,
        toggleMobileMenu,
        navigation,
    } = useInitiativeLayoutStore();

    // Hook: Get breakpoint
    const bp = useResponsive();

    // Effect: Listen to breakpoint and toggle menu accordingly
    const largeBps = ['md', 'lg', 'xl', '2xl', '3xl'];
    useEffect(() => {
        if (largeBps.includes(bp)) {
            toggleMobileMenu(false);
        }
    }, [bp]);

    // Ref: Mobile navigation wrapper
    const mobileNavigationRef = useRef(null);

    // Effect: Catch outside clicks and close
    useEffect(() => {
        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [mobileMenuActive]);

    // Function: Event wrapper for closing outside click
    function handleClick(event) {
        if (
            mobileMenuActive &&
            mobileNavigationRef.current &&
            !mobileNavigationRef.current.contains(event.target)
        ) {
            toggleMobileMenu(false);
        }
    }

    return (
        <div
            className="absolute left-0 right-0 flex justify-end top-[176px] md:hidden page-px z-above"
            ref={mobileNavigationRef}>
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
                                className="flex items-center text-blue-300 t-h6 transition-default hover:text-blue-200">
                                {item.label}
                            </a>
                        </ActiveLink>
                    ))}
                </div>
            </div>
        </div>
    );
};

MobileNavigationComponent.propTypes = {};

MobileNavigationComponent.defaultProps = {};

export default MobileNavigationComponent;
