// React
import React, { useEffect, useRef, useState } from 'react';

// Packages
import cc from 'classcat';

// Utilities
import { useInitiativeLayoutStore } from 'utilities/store';
import { useResponsive, useLabels, useContext } from 'utilities/hooks';

// Components
import ActiveLink from 'components/activeLink';
import IconButton from 'components/iconButton';

// Icons
import {
    FiAlignRight,
    FiChevronsRight,
    FiChevronDown,
    FiChevronUp,
} from 'react-icons/fi';

const MobileNavigationComponent = () => {
    // Hook: Context
    const { INITIATIVE_ID } = useContext();

    // Store: InitiativeLayout
    const {
        mobileMenuActive,
        toggleMobileMenu,
        navigation,
    } = useInitiativeLayoutStore();

    // Hook: Metadata
    const { label } = useLabels();

    // Open/Close submenu
    const [subMenuActive, setSubMenuActive] = useState(false);

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
    const handleClick = event => {
        if (
            mobileMenuActive &&
            mobileNavigationRef.current &&
            !mobileNavigationRef.current.contains(event.target)
        ) {
            toggleMobileMenu(false);
        }
    };

    const toggleSubMenu = () => {
        setSubMenuActive(!subMenuActive);
    };

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
                    className="self-end -mr-4"
                />
                {/* space-y-24 */}
                <div className="flex flex-col pr-32">
                    {navigation.map((item, index) => {
                        // Submenu
                        if (!item.slug) {
                            return (
                                <div
                                    key={index}
                                    className="flex flex-col items-start mt-24 text-blue-300 rounded-8 hover:text-blue-200 transition-default">
                                    <button
                                        className="flex outline-none t-h6 focus:outline-none"
                                        onClick={toggleSubMenu}>
                                        {label(item.label)}
                                        {subMenuActive && (
                                            <FiChevronUp className="ml-4" />
                                        )}
                                        {!subMenuActive && (
                                            <FiChevronDown className="ml-4" />
                                        )}
                                    </button>
                                    <div
                                        className={cc([
                                            'transition-default flex flex-col ml-24 overflow-hidden',
                                            {
                                                'h-auto': subMenuActive,
                                                'h-0': !subMenuActive,
                                            },
                                        ])}>
                                        {item.subItems.map((subItem, i) => (
                                            <ActiveLink
                                                href={`/${INITIATIVE_ID}/${subItem.slug}`}
                                                key={i}
                                                active="text-blue-100">
                                                <a
                                                    onClick={() => {
                                                        toggleMobileMenu(false);
                                                    }}
                                                    className="flex flex-col mt-24 text-blue-300 t-h6 transition-default hover:text-blue-200">
                                                    {label(subItem.label)}
                                                </a>
                                            </ActiveLink>
                                        ))}
                                    </div>
                                </div>
                            );
                        }
                        // Normal menu item
                        else {
                            return (
                                <ActiveLink
                                    href={`/${INITIATIVE_ID}/${item.slug}`}
                                    key={index}
                                    active="text-blue-100">
                                    <a
                                        onClick={() => {
                                            toggleMobileMenu(false);
                                        }}
                                        className="flex items-center mt-24 text-blue-300 t-h6 transition-default hover:text-blue-200">
                                        {label(item.label)}
                                    </a>
                                </ActiveLink>
                            );
                        }
                    })}
                </div>
            </div>
        </div>
    );
};

MobileNavigationComponent.propTypes = {};

MobileNavigationComponent.defaultProps = {};

export default MobileNavigationComponent;
