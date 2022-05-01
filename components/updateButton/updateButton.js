// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';
import { useRouter } from 'next/router';

// Utilities
import { useLabels, useContext, useAuth, useSalesForce } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import Button from 'components/button';

const UpdateButtonComponent = ({ mode, baseUrl, variant = 'secondary' }) => {
    // Hook: Context
    const { INITIATIVE_ID, REPORT_ID } = useContext();

    // Hook: Router
    const router = useRouter();

    // Hook: Metadata
    const { label } = useLabels();

    // Hook: Salesforce setup
    const { sfUpdate } = useSalesForce();

    // Hook: Auth
    const { userInitiativeRights } = useAuth();

    // Initiative data
    const { updateReport, utilities, CONSTANTS } = useInitiativeDataStore();

    const [canUpdate, setCanUpdate] = useState(true);

    // method: set report to in progress
    async function reportInProgress() {
        try {
            if (
                utilities.reports.get(REPORT_ID).Status__c ===
                CONSTANTS.TYPES.REPORT_NOT_STARTED
            ) {
                // Object name
                const object = 'Initiative_Report__c';

                // Data for sf
                const data = {
                    Status__c: CONSTANTS.TYPES.REPORT_IN_PROGRESS,
                };

                // Update
                await sfUpdate({ object, data, id: REPORT_ID });

                // Update store
                await updateReport(REPORT_ID);
            }

            // Change location
            router.push(
                `/wizard/${INITIATIVE_ID}/${baseUrl}/${REPORT_ID}/update`
            );
        } catch (error) {
            console.warn(error);
        }
    }

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
