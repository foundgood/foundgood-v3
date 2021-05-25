// React
import React, { useEffect, useState } from 'react';

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
    const { newNavigation } = useInitiativeLayoutStore();

    // Hook: Metadata
    const { label } = useMetadata();

    const [menuActive, setMenuActive] = useState(false);

    const toggleMenu = () => {
        setMenuActive(!menuActive);
    };

    return (
        <>
            {INITIATIVE_ID && (
                <div className="relative items-start justify-end hidden space-x-16 md:flex page-px tab-nav-bg">
                    {newNavigation.map((item, index) => {
                        // Submenu
                        if (!item.slug) {
                            return (
                                <div
                                    key={index}
                                    className={cc([
                                        'flex flex-col px-16 pb-16 pt-[14px] mt-4 items-start rounded-8 text-blue-300 hover:text-blue-200 transition-default',
                                        {
                                            'bg-blue-20': menuActive,
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
