// React
import React from 'react';

// Packages

// Utilities
import { useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import { ReportUpdate } from 'components/_wizard/_cards';

const ActivityComponent = ({ item, tagTypes = [] }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label } = useLabels();

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <ReportUpdate
            {...{
                title: label('ReportUpdateModalActivitiesHeading'),
                tagging: {
                    item,
                    relationKey: 'Initiative_Activity__c',
                    types: tagTypes,
                },
                status: {
                    item,
                    relationKey: 'Initiative_Activity__c',
                    type: CONSTANTS.REPORT_DETAILS.ACTIVITY_OVERVIEW,
                },
                metrics: {
                    item,
                },
                reflection: {
                    item,
                    relationKey: 'Initiative_Activity__c',
                    type: CONSTANTS.REPORT_DETAILS.ACTIVITY_OVERVIEW,
                },
            }}
        />
    );
};

ActivityComponent.propTypes = {};

ActivityComponent.defaultProps = {};

export default ActivityComponent;
