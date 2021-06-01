// React
import React, { useEffect, useState, useRef } from 'react';

// Packages
import cc from 'classcat';

// Utilities
import { useMetadata, useContext } from 'utilities/hooks';
import { useInitiativeLayoutStore } from 'utilities/store';

// Components
import ActiveLink from 'components/activeLink';

// Icons
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const TabNavigationComponent = () => {
    // Hook: Context
    const { INITIATIVE_ID } = useContext();

    // Store: InitiativeLayout
    const { navigation } = useInitiativeLayoutStore();

    // Hook: Metadata
    const { label } = useMetadata();

    const [menuActive, setMenuActive] = useState(false);

    const toggleMenu = () => {
        setMenuActive(!menuActive);
    };

    // Ref: Mobile navigation wrapper
    const navigationRef = useRef(null);

    // Effect: Catch outside clicks and close
    useEffect(() => {
        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [menuActive]);

    // Function: Event wrapper for closing outside click
    const handleClick = event => {
        if (
            menuActive &&
            navigationRef.current &&
            !navigationRef.current.contains(event.target)
        ) {
            setMenuActive(false);
        }
    };
    const testActive = true;

    return (
        <>
            {INITIATIVE_ID && (
                <div
                    className="relative items-start justify-end hidden space-x-16 md:flex page-px tab-nav-bg"
                    ref={navigationRef}>
                    {navigation.map((item, index) => {
                        // Submenu
                        if (!item.slug) {
                            return (
                                <div
                                    key={index}
                                    className={cc([
                                        'flex flex-col px-16 pb-16 pt-[14px] mt-4 items-start text-blue-300 hover:text-blue-200 transition-default',
                                        {
                                            'bg-blue-20 rounded-8': menuActive,
                                            // 'text-blue-100 border-t-2 border-blue-100': testActive,
                                        },
                                    ])}>
                                    <button
                                        className="flex outline-none t-h6 focus:outline-none"
                                        onClick={toggleMenu}>
                                        {label(item.label)}
                                        {menuActive && (
                                            <FiChevronUp className="ml-4" />
                                        )}
                                        {!menuActive && (
                                            <FiChevronDown className="ml-4" />
                                        )}
                                    </button>
                                    <div
                                        className={cc([
                                            'transition-default flex flex-col',
                                            {
                                                'opacity-100 pointer-events-auto': menuActive,
                                                'opacity-0 pointer-events-none': !menuActive,
                                            },
                                        ])}>
                                        {item.subItems.map((subItem, i) => (
                                            <div key={`sub-${i}`} className="">
                                                <ActiveLink
                                                    href={`/${INITIATIVE_ID}/${subItem.slug}`}
                                                    key={i}
                                                    active="text-blue-100">
                                                    <a className="flex flex-col pt-12 text-blue-300 t-h6 transition-default hover:text-blue-200">
                                                        {label(subItem.label)}
                                                    </a>
                                                </ActiveLink>
                                            </div>
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
                                    active="text-blue-100 !border-blue-100">
                                    <a className="flex items-center py-16 text-blue-300 border-t-2 border-amber-10 t-h6 transition-default hover:text-blue-200">
                                        {label(item.label)}
                                    </a>
                                </ActiveLink>
                            );
                        }
                    })}
                </div>
            )}
        </>
    );
};

TabNavigationComponent.propTypes = {};

TabNavigationComponent.defaultProps = {};

export default TabNavigationComponent;
