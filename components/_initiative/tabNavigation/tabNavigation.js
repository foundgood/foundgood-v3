// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';

// Utilities
import { useInitiativeLayoutStore } from 'utilities/store';
import { useResponsive, useContext } from 'utilities/hooks';

// Components
import ActiveLink from 'components/activeLink';
import IconButton from 'components/iconButton';

// Icons
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const TabNavigationComponent = () => {
    const { initiativeId } = useInitiativeLayoutStore();

    // useEffect(() => {
    //     console.log('initiativeId: ', initiativeId);
    // }, [initiativeId]);

    // Hook: Context
    const { INITIATIVE_ID } = useContext();

    // Store: InitiativeLayout
    const { newNavigation, navigation } = useInitiativeLayoutStore();

    const [menuActive, setMenuActive] = useState(false);
    const [subMenuIsActive, setSubMenuIsActive] = useState(false);
    const toggleMenu = () => {
        console.log('menuOpen: ', menuActive);
        setMenuActive(!menuActive);
    };

    console.log('newNavigation: ', newNavigation);

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
                                    onMouseEnter={toggleMenu}
                                    onMouseLeave={toggleMenu}
                                    className={cc([
                                        'flex flex-col px-16 pb-16 pt-[14px] mt-4 items-start rounded-8 text-blue-300 t-h6 hover:text-blue-200',
                                        {
                                            'text-blue-100 ': subMenuIsActive,
                                            'bg-blue-20': menuActive,
                                        },
                                    ])}>
                                    <div className="flex">
                                        {item.label}
                                        {menuActive && (
                                            <FiChevronUp className="ml-4" />
                                        )}
                                        {!menuActive && (
                                            <FiChevronDown className="ml-4" />
                                        )}
                                    </div>
                                    <div
                                        className={cc([
                                            {
                                                'flex flex-col': menuActive,
                                                hidden: !menuActive,
                                            },
                                        ])}>
                                        {item.subItems.map((subItem, i) => (
                                            <div key={`sub-${i}`} className="">
                                                <ActiveLink
                                                    href={`/${INITIATIVE_ID}/${subItem.slug}`}
                                                    key={i}
                                                    active="text-blue-100">
                                                    <a className="flex flex-col pt-12 text-blue-300 t-h6 transition-default hover:text-blue-200">
                                                        {subItem.label}
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
                                        {item.label}
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
