// React
import React from 'react';

// Packages

// Utilities
import { useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import { ReportUpdate } from 'components/_wizard/_cards';

const ResultComponent = ({ item }) => {
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
                title: label('ReportUpdateModalResultsHeading'),
                reflection: {
                    item,
                    relationKey: 'Initiative_Result__c',
                    type: CONSTANTS.REPORT_DETAILS.RESULTS,
                },
            }}
        />
    );
};

ResultComponent.propTypes = {};

ResultComponent.defaultProps = {};

export default ResultComponent;
