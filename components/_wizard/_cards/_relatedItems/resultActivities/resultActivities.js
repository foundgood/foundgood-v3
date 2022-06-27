// React
import React from 'react';

// Packages

// Utilities
import { useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import { RelatedItems } from 'components/_wizard/_cards';

const ResultActivitiesComponent = ({ item }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label, getValueLabel } = useLabels();

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <RelatedItems
            {...{
                title: label('CardRelatedItemsHeadingActivities'),
                collection: {
                    title(item) {
                        return item?.Initiative_Activity__r?.Things_To_Do__c;
                    },
                    type(item) {
                        return getValueLabel(
                            'Initiative_Activity__c.Activity_Type__c',
                            item?.Initiative_Activity__r?.Activity_Type__c
                        );
                    },
                    items: utilities.resultActivities.getFromResultId(item.Id),
                },
            }}
        />
    );
};

ResultActivitiesComponent.propTypes = {};

ResultActivitiesComponent.defaultProps = {};

export default ResultActivitiesComponent;
