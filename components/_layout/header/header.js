// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Components

// Images
import { FiBook, FiInbox, FiUser, FiChevronDown } from 'react-icons/fi';
import FGLogo from 'assets/images/fg-logo.svg';

const HeaderComponent = ({ showUserControls }) => {
    // Hook: Metadata
    const { labelTodo } = useMetadata();

    const userName = 'Jenny Lindh';

    const onToggleUserNaviagtion = () => {
        console.log('toggle user nav');
    };

    return (
        <div className="fixed flex items-center justify-between w-screen text-blue-300 z-header header-h page-px">
            <Link href="/">
                <a>
                    <FGLogo className="fill-current" />
                </a>
            </Link>

            {showUserControls && (
                <ul className="flex">
                    <li className="mx-20 lg:cursor-pointer hover:text-coral-300">
                        <Link href="/#">
                            <a>
                                <FiBook className="w-24 h-24 mx-auto stroke-current" />
                                <span className="hidden lg:block">
                                    {labelTodo('Initiatives')}
                                </span>
                            </a>
                        </Link>
                    </li>
                    <li className="mx-20 lg:cursor-pointer hover:text-coral-300">
                        <Link href="/#">
                            <a>
                                <FiInbox className="w-24 h-24 mx-auto stroke-current" />
                                <span className="hidden lg:block">
                                    {labelTodo('Reports')}
                                </span>
                            </a>
                        </Link>
                    </li>
                    <li
                        className="mx-20 lg:cursor-pointer hover:text-coral-300 hover:border-coral-300"
                        onClick={onToggleUserNaviagtion}>
                        <FiUser className="w-24 h-24 mx-auto stroke-current" />
                        <div className="items-center hidden lg:flex">
                            {userName}
                            <FiChevronDown className="w-18 h-18" />
                        </div>
                    </li>
                </ul>
            )}
        </div>
    );
};

HeaderComponent.propTypes = {
    showUserControls: t.bool,
};

HeaderComponent.defaultProps = {
    showUserControls: true,
};

export default HeaderComponent;
