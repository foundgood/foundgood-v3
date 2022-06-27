// React
import React from 'react';

// Packages

// Utilities
import { useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import { RelatedItems } from 'components/_wizard/_cards';

const ResultGoalsComponent = ({ item }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label } = useLabels();

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <RelatedItems
            {...{
                title: label('CardRelatedItemsHeadingGoals'),
                collection: {
                    title(item) {
                        return item.Initiative_Goal__r.Goal__c;
                    },
                    type() {
                        return label('CardTypeGoal');
                    },
                    items: utilities.resultGoals.getFromResultId(item.Id),
                },
            }}
        />
    );
};

ResultGoalsComponent.propTypes = {};

ResultGoalsComponent.defaultProps = {};

export default ResultGoalsComponent;
