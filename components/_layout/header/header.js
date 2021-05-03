// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';

// Utilities
import { useMetadata, useAuth } from 'utilities/hooks';

// Components

// Images
import { FiHeart, FiInbox, FiUser, FiChevronDown } from 'react-icons/fi';
import FGLogo from 'assets/images/fg-logo.svg';

const HeaderComponent = ({ showUserControls }) => {
    // Hook: Metadata
    const { labelTodo } = useMetadata();

    // Hook: Auth
    const { user } = useAuth();

    const onToggleUserNaviagtion = () => {
        console.log('toggle user nav');
    };

    return (
        <>
            <div className="fixed flex items-center justify-between header-h page-mx z-logo">
                <Link href="/">
                    <a className="f">
                        <FGLogo className="fill-current" />
                    </a>
                </Link>
            </div>
            <div className="fixed left-0 flex items-center justify-end w-full text-blue-300 bg-white z-header header-h page-px">
                {showUserControls && (
                    <ul className="flex space-x-20 t-aside-nav">
                        <li className="lg:cursor-pointer hover:text-blue-100">
                            <Link href="/#">
                                <a>
                                    <FiHeart className="w-24 h-24 mx-auto stroke-current" />
                                    <span className="hidden mt-4 lg:block">
                                        {labelTodo('Initiatives')}
                                    </span>
                                </a>
                            </Link>
                        </li>
                        <li className="lg:cursor-pointer hover:text-blue-100">
                            <Link href="/#">
                                <a>
                                    <FiInbox className="w-24 h-24 mx-auto stroke-current" />
                                    <span className="hidden mt-4 lg:block">
                                        {labelTodo('Reports')}
                                    </span>
                                </a>
                            </Link>
                        </li>
                        <li
                            // flex
                            // lg:display
                            className="flex lg:block lg:cursor-pointer hover:text-blue-100 hover:border-blue-100"
                            onClick={onToggleUserNaviagtion}>
                            <FiUser className="w-24 h-24 mx-auto stroke-current" />
                            {user && (
                                <div className="flex mt-4 lg:items-center">
                                    <span className="hidden lg:inline">
                                        {user.name}
                                    </span>
                                    <FiChevronDown className="w-18 h-18" />
                                </div>
                            )}
                        </li>
                    </ul>
                )}
            </div>
        </>
    );
};

HeaderComponent.propTypes = {
    showUserControls: t.bool,
};

HeaderComponent.defaultProps = {
    showUserControls: true,
};

export default HeaderComponent;
