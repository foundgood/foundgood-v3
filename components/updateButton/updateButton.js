// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';
import { useRouter } from 'next/router';

// Utilities
import { useLabels, useContext, useAuth } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import Button from 'components/button';

const UpdateButtonComponent = ({ mode, baseUrl, variant = 'secondary' }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const router = useRouter();
    const { INITIATIVE_ID, REPORT_ID } = useContext();
    const { label } = useLabels();
    const { userInitiativeRights } = useAuth();
    const { ewUpdate } = useElseware();

    // ///////////////////
    // STATE
    // ///////////////////

    const [canUpdate, setCanUpdate] = useState(true);

    // ///////////////////
    // METHODS
    // ///////////////////

    async function reportInProgress() {
        try {
            if (
                utilities.reports.get(REPORT_ID).Status__c ===
                CONSTANTS.TYPES.REPORT_NOT_STARTED
            ) {
                const { data: reportData } = await ewUpdate(
                    'initiative-report/initiative-report',
                    REPORT_ID,
                    {
                        Status__c: CONSTANTS.REPORTS.REPORT_IN_PROGRESS,
                    }
                );

                // Update store
                utilities.updateInitiativeData('_reports', reportData);
            }

            // Change location
            router.push(
                `/wizard/${INITIATIVE_ID}/${baseUrl}/${REPORT_ID}/update`
            );
        } catch (error) {
            console.warn(error);
        }
    }

    // ///////////////////
    // EFFECTS
    // ///////////////////

    useEffect(() => {
        // User needs to have rights to edit
        // If "report" page, then the status cannot be published
        const reportPage = mode === 'report' ? true : false;
        const canUpdate =
            userInitiativeRights.canEdit &&
            (reportPage
                ? utilities.reports.get(REPORT_ID).Status__c !==
                  CONSTANTS.TYPES.REPORT_PUBLISHED
                    ? true
                    : false
                : true);

        setCanUpdate(canUpdate);
    }, [userInitiativeRights]);

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <>
            {canUpdate && (
                <Button
                    variant={variant}
                    action={
                        mode === 'report'
                            ? reportInProgress
                            : `/wizard/${INITIATIVE_ID}/${baseUrl}/update`
                    }>
                    {label('Update')}
                </Button>
            )}
        </>
    );
};

UpdateButtonComponent.propTypes = {
    mode: t.oneOf(['initiative', 'report']).isRequired,
    baseUrl: t.string.isRequired,
    // Button variant (primary, secondary...)
    variant: t.string,
};

UpdateButtonComponent.defaultProps = {};

export default UpdateButtonComponent;
