// React
import React, { useEffect } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Utilities
import { useInitiativeDataStore } from 'utilities/store';
import { useContext, useAuth, useMetadata } from 'utilities/hooks';

// Components
import Button from 'components/button';
import Footer from 'components/_layout/footer';
import MobileNavigation from 'components/_initiative/mobileNavigation';
import TabNavigation from 'components/_initiative/tabNavigation';

const InitiativeLayoutComponent = ({ children, pageProps }) => {
    // Store: Initiative data store
    const { populateInitiative, initiative } = useInitiativeDataStore();

    // Hook: Metadata
    const { label } = useMetadata();

    // Hook: Context
    const { INITIATIVE_ID } = useContext();

    // Hook: Auth
    const { getUserInitiativeRights, userInitiativeRights } = useAuth();

    useEffect(() => {
        populateInitiative(INITIATIVE_ID);

        // Get user rights for current initiative
        if (INITIATIVE_ID) {
            getUserInitiativeRights(INITIATIVE_ID);
        }
    }, [INITIATIVE_ID]);

    return (
        <>
            <div className="fixed inset-0 bg-amber-10"></div>
            {/* Initiative title and initiative navigation wrapper */}
            <div className="fixed left-0 right-0 flex flex-col header-t z-below-aside">
                {/* Iniative title */}
                <div className="flex items-center justify-between py-16 bg-blue-20 page-px">
                    <p className="font-medium text-blue-100 t-sh5 md:flex line-clamp-3">
                        {initiative.Name}
                    </p>

                    {userInitiativeRights.canEdit && (
                        <Button
                            theme="blue"
                            variant="secondary"
                            action={`/wizard/${INITIATIVE_ID}/overview`}>
                            {label('custom.FA_ButtonRunWizard')}
                        </Button>
                    )}
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
