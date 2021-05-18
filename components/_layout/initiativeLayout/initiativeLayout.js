// React
import React, { useEffect } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Utilities
import {
    useInitiativeLayoutStore,
    useInitiativeDataStore,
} from 'utilities/store';
import { useMetadata } from 'utilities/hooks';

// Components
import Footer from 'components/_layout/footer';
import ActiveLink from 'components/activeLink';
import MobileNavigation from 'components/_initiative/mobileNavigation';

const InitiativeLayoutComponent = ({ children, pageProps }) => {
    // Store: InitiativeLayout
    const { navigation } = useInitiativeLayoutStore();
    const { populateInitiative } = useInitiativeDataStore();

    // Hook: Metadata
    const { labelTodo } = useMetadata();

    useEffect(() => {
        // Fetch initiative data
        // TODO - Get ID from URL or Store
        const id = 'a0p1x00000EkTIwAAN'; // New one from Luke!
        // const id = 'a0p1x00000Eh8COAAZ'; // Org test case from Hanne
        populateInitiative(id);
    }, []);

    return (
        <>
            <div className="fixed inset-0 bg-amber-10"></div>
            {/* Initiative title and initiative navigation wrapper */}
            <div className="fixed left-0 right-0 flex flex-col header-t z-below-aside">
                {/* Iniative title */}
                <div className="flex items-center justify-start py-16 bg-blue-20 page-px">
                    <p className="font-medium text-blue-100 t-sh5 md:flex line-clamp-3">
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
                            <a className="flex items-center h-56 text-blue-300 border-t-2 border-amber-10 t-h6 transition-default hover:text-blue-200">
                                {item.label}
                            </a>
                        </ActiveLink>
                    ))}
                </div>
            </div>
            {/* Mobile navigation */}
            <MobileNavigation />
            {/* Content wrapper */}
            <div
                className={cc([
                    'absolute flex h-full justify-center left-0 right-0',
                ])}>
                {/* Content */}
                <div className="w-full max-w-[900px] page-mx mt-160 md:mt-232 pb-64 lg:pb-96 rounded-8">
                    {children}
                    <Footer />
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
