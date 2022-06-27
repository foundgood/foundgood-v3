// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useLabels } from 'utilities/hooks';

// Components

const ActivityEvaluationComponent = ({ item }) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { dataSet, getValueLabel, object } = useLabels();

    // ///////////////////
    // DATA
    // ///////////////////

    const country = item?.Initiative_Location__c
        ? dataSet('Countries').find(
              c => c.value === item?.Initiative_Location__c
          )?.label ?? null
        : null;

    const otherLocation = item?.Additional_Location_Information__c;

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div className="flex flex-col mb-16 space-y-12">
            {/* Evaluation tyåe */}
            <div>
                <h5 className="mt-16 t-caption-bold text-teal-60">
                    {object.label('Initiative_Activity__c.Whos_Evaluating__c')}
                </h5>
                <p>
                    {getValueLabel(
                        'Initiative_Activity__c.Whos_Evaluating__c',
                        item?.Whos_Evaluating__c
                    )}
                </p>
            </div>

            {/* Location */}
            {[country, otherLocation].some(x => x) && (
                <div>
                    <h5 className="mt-16 t-caption-bold text-teal-60">
                        {object.label(
                            'Initiative_Activity__c.Initiative_Location__c__Engagement'
                        )}
                    </h5>
                    <p>
                        {otherLocation && otherLocation}
                        {otherLocation && country && `, `}
                        {country && country}
                    </p>
                </div>
            )}

            {/* Description */}
            <p className="text-teal-60">{item?.Things_To_Do_Description__c}</p>
        </div>
    );
};

ActivityEvaluationComponent.propTypes = {
    item: t.object,
};

ActivityEvaluationComponent.defaultProps = {};

export default ActivityEvaluationComponent;
