// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import {
    useMetadata,
    useContext,
    useAuth,
    useSalesForce,
} from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import Button from 'components/button';

const UpdateButtonComponent = ({ mode, baseUrl }) => {
    // Hook: Context
    const { INITIATIVE_ID, REPORT_ID } = useContext();

    // Hook: Metadata
    const { label } = useMetadata();

    // Hook: Salesforce setup
    const { sfUpdate } = useSalesForce();

    // Hook: Auth
    const { userInitiativeRights } = useAuth();

    // Initiative data
    const { updateReport, getReport, CONSTANTS } = useInitiativeDataStore();

    // method: set report to in progress
    async function reportInProgress() {
        try {
            if (
                getReport(REPORT_ID).Status__c ===
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
            router.push(`/wizard/${INITIATIVE_ID}/${baseUrl}/${REPORT_ID}`);
        } catch (error) {
            console.warn(error);
        }
    }

    return (
        <Button
            variant="secondary"
            action={
                mode === 'report'
                    ? reportInProgress
                    : `/wizard/${INITIATIVE_ID}/${baseUrl}`
            }
            disabled={
                !userInitiativeRights.canEdit ||
                (mode === 'report' &&
                    ![
                        CONSTANTS.TYPES.REPORT_NOT_STARTED,
                        CONSTANTS.TYPES.REPORT_IN_PROGRESS,
                    ].includes(getReport(REPORT_ID).Status__c))
            }>
            {label('custom.FA_Update')}
        </Button>
    );
};

UpdateButtonComponent.propTypes = {
    mode: t.oneOf(['initiative', 'report']).isRequired,
    baseUrl: t.string.isRequired,
};

UpdateButtonComponent.defaultProps = {};

export default UpdateButtonComponent;
