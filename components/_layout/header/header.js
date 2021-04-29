// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';

// Utilities

// Components

// Images
import { FiBook, FiInbox, FiUser, FiChevronDown } from 'react-icons/fi';
import FGLogo from 'assets/images/fg-logo.svg';

const HeaderComponent = ({ showUserControls }) => {
    const userName = 'Jenny Lindh';

    const onToggleUserNaviagtion = () => {
        console.log('toggle user nav');
    };

    return (
        <div className="bg-fixed flex items-center justify-between w-screen h-48 px-16 text-blue-300 z-header sm:px-24 lg:px-32 lg:h-64 sm:h-56">
            <Link href="/">
                <a>
                    <FGLogo className="fill-current" />
                </a>
            </Link>

            {showUserControls && (
                <ul className="flex">
                    <li className="mx-20 lg:cursor-pointer transition-default hover:text-blue-100">
                        <Link href="/#">
                            <a>
                                <FiBook className="mx-auto stroke-current w-24 h-24" />
                                <span className="hidden lg:block">
                                    Initiatives
                                </span>
                            </a>
                        </Link>
                    </li>
                    <li className="mx-20 lg:cursor-pointer transition-default hover:text-blue-100">
                        <Link href="/#">
                            <a>
                                <FiInbox className="mx-auto stroke-current w-24 h-24" />
                                <span className="hidden lg:block">Reports</span>
                            </a>
                        </Link>
                    </li>
                    <li
                        className="mx-20 lg:cursor-pointer transition-default hover:text-blue-100 hover:border-blue-100"
                        onClick={onToggleUserNaviagtion}>
                        <FiUser className="mx-auto stroke-current w-24 h-24" />
                        <div className="hidden items-center lg:flex">
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
