// React
import React from 'react';

// Packages
import t from 'prop-types';
import { useRouter } from 'next/router';

// Utilities
import { useLabels, useContext, useElseware } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import Button from 'components/button';
import Permission from 'components/permission';

const UpdateButtonComponent = ({ context, baseUrl, variant, rules }) => {
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
    const { ewUpdate } = useElseware();

    // ///////////////////
    // METHODS
    // ///////////////////

    async function reportInProgress() {
        try {
            // Start report if not started
            if (
                utilities.reports.get(REPORT_ID).Status__c ===
                CONSTANTS.REPORTS.REPORT_NOT_STARTED
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
                `/report/${INITIATIVE_ID}/${baseUrl}/${REPORT_ID}/update`
            );
        } catch (error) {
            console.warn(error);
        }
    }

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <Permission
            {...{
                rules,
                additionalRules: [
                    context === 'report'
                        ? utilities.reports.get(REPORT_ID).Status__c !==
                          CONSTANTS.REPORTS.REPORT_PUBLISHED
                        : true,
                ],
            }}>
            <Button
                variant={variant}
                action={
                    context === 'report'
                        ? reportInProgress
                        : `/${context}/${INITIATIVE_ID}/${baseUrl}/update`
                }>
                {label('Update')}
            </Button>
        </Permission>
    );
};

UpdateButtonComponent.propTypes = {
    context: t.oneOf(['initiative', 'report', 'create']).isRequired,
    baseUrl: t.string.isRequired,
    // Button variant (primary, secondary...)
    variant: t.string,
    permissions: t.array.isRequired,
};

UpdateButtonComponent.defaultProps = {
    context: 'initiative',
    variant: 'secondary',
    permissions: [],
};

export default UpdateButtonComponent;
