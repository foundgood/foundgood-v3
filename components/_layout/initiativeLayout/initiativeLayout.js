// React
import React, { useEffect } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Utilities
import { useInitiativeDataStore } from 'utilities/store';
import { useContext, useUser, useLabels } from 'utilities/hooks';

// Components
import Button from 'components/button';
import MobileNavigation from 'components/_initiative/mobileNavigation';
import TabNavigation from 'components/_initiative/tabNavigation';

const InitiativeLayoutComponent = ({ children, pageProps }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { populateInitiative, utilities } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label } = useLabels();
    const { INITIATIVE_ID } = useContext();
    const { getUserInitiativeRights } = useUser();

    // ///////////////////
    // EFFECTS
    // ///////////////////

    useEffect(() => {
        populateInitiative(INITIATIVE_ID);
    }, [INITIATIVE_ID]);

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <>
            <div className="fixed inset-0 bg-amber-10"></div>
            {/* Initiative title and initiative navigation wrapper */}
            <div className="fixed left-0 right-0 flex flex-col header-t z-below-aside">
                {/* Iniative title */}
                <div className="flex items-center justify-between py-16 bg-blue-20 page-px">
                    <p className="font-medium text-blue-100 t-sh5 md:flex line-clamp-3">
                        {utilities.initiative.get().Name}
                    </p>

                    {getUserInitiativeRights().canEdit && (
                        <Button
                            theme="blue"
                            variant="secondary"
                            action={`/initiative/${INITIATIVE_ID}/overview`}>
                            {label('ButtonRunWizard')}
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
