// React
import React, { useEffect } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { useRouter } from 'next/router';

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
import TabNavigation from 'components/_initiative/tabNavigation';

const InitiativeLayoutComponent = ({ children, pageProps }) => {
    const router = useRouter();
    const { initiativeId } = router.query;

    // Store: InitiativeLayout
    const {
        navigation,
        newNavigation,
        updateInitiativeId,
    } = useInitiativeLayoutStore();
    const { populateInitiative } = useInitiativeDataStore();
    // const { updateInitiativeId } = useInitiativeId();

    // Hook: Metadata
    const { labelTodo } = useMetadata();

    useEffect(() => {
        if (initiativeId) {
            updateInitiativeId(initiativeId);
            populateInitiative(initiativeId);
        }
    }, [initiativeId]);

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
                <TabNavigation />
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
