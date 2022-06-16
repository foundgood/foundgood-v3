// React
import React, { useEffect, useState, useRef } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Utilities
import { useLabels, useUser } from 'utilities/hooks';

// Components

// Images
import { FiHeart, FiInbox, FiUser, FiChevronDown } from 'react-icons/fi';
import FGLogo from 'assets/images/fg-logo.svg';

const HeaderComponent = ({ showUserControls }) => {
    // Hook: Metadata
    const { label } = useLabels();

    // Hook: Auth
    const { getUserLoggedIn, getUserName, userLogout } = useUser();

    // Hook: Router
    const router = useRouter();

    // Local state for userNavigation
    const [userNavActive, setUserNavActive] = useState(false);

    // Ref: Mobile navigation wrapper
    const userNavigationRef = useRef(null);

    // Effect: Catch outside clicks and close
    useEffect(() => {
        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [userNavActive]);

    // Function: Event wrapper for closing outside click
    function handleClick(event) {
        if (
            userNavActive &&
            userNavigationRef.current &&
            !userNavigationRef.current.contains(event.target)
        ) {
            setUserNavActive(false);
        }
    }

    return getUserLoggedIn() ? (
        <>
            <div
                className={cc([
                    'fixed flex items-center justify-between header-h page-mx z-logo print:hidden',
                    {
                        'bg-white w-full xl:w-auto xl:bg-transparent': !showUserControls,
                    },
                ])}>
                <Link href="/">
                    <a className="f">
                        <FGLogo className="text-blue-300 fill-current" />
                    </a>
                </Link>
            </div>
            <div
                className={cc([
                    'fixed left-0 flex items-center justify-end w-full text-blue-300 z-header header-h page-px print:hidden',
                    {
                        'bg-white': showUserControls,
                    },
                ])}>
                {showUserControls && (
                    <ul className="flex space-x-20 t-aside-nav">
                        <li className="lg:cursor-pointer hover:text-blue-100">
                            <Link href="/">
                                <a>
                                    <FiHeart className="w-24 h-24 mx-auto stroke-current" />
                                    <span className="hidden mt-4 select-none lg:block">
                                        {label('MenuInitiatives')}
                                    </span>
                                </a>
                            </Link>
                        </li>
                        <li className="lg:cursor-pointer hover:text-blue-100">
                            <Link href="/reports">
                                <a>
                                    <FiInbox className="w-24 h-24 mx-auto stroke-current" />
                                    <span className="hidden mt-4 select-none lg:block">
                                        {label('TabReports')}
                                    </span>
                                </a>
                            </Link>
                        </li>
                        <li
                            className="flex lg:block lg:cursor-pointer hover:text-blue-100 hover:border-blue-100"
                            onClick={() => setUserNavActive(!userNavActive)}>
                            <FiUser className="w-24 h-24 mx-auto stroke-current" />
                            {getUserName() && (
                                <div className="flex mt-4 lg:items-center">
                                    <span className="hidden select-none lg:inline">
                                        {getUserName()}
                                    </span>
                                    <FiChevronDown className="w-18 h-18" />
                                </div>
                            )}
                        </li>
                    </ul>
                )}
            </div>
            <div
                ref={userNavigationRef}
                className={cc([
                    'fixed bg-white p-16 rounded-8 header-t right-0 page-mr flex flex-col space-y-16 min-w-[192px] mt-8 z-logo transform transition-default print:hidden',
                    {
                        'opacity-100 translate-x-0 pointer-events-auto': userNavActive,
                        'opacity-0 -translate-y-10 pointer-events-none': !userNavActive,
                    },
                    ,
                ])}>
                <span className="flex items-center space-x-6 text-blue-300 t-h6">
                    <Link href={router.asPath} locale="en">
                        <a
                            onClick={() => setUserNavActive(false)}
                            className={cc([
                                't-h6 transition-default hover:text-blue-200',
                                { 'text-blue-100': router.locale === 'en' },
                            ])}>
                            {label('MenuLanguageEN')}
                        </a>
                    </Link>
                    <span>/</span>
                    <Link href={router.asPath} locale="da">
                        <a
                            onClick={() => setUserNavActive(false)}
                            className={cc([
                                't-h6 transition-default hover:text-blue-200',
                                { 'text-blue-100': router.locale === 'da' },
                            ])}>
                            {label('MenuLanguageDK')}
                        </a>
                    </Link>
                </span>
                <button
                    onClick={() => {
                        userLogout();
                    }}
                    className="flex items-center text-blue-300 t-h6 transition-default hover:text-blue-200">
                    {label('LogOut')}
                </button>
            </div>
        </>
    ) : null;
};

HeaderComponent.propTypes = {
    showUserControls: t.bool,
};

HeaderComponent.defaultProps = {
    showUserControls: true,
};

export default HeaderComponent;
