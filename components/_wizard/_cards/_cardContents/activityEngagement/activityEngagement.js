// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useLabels } from 'utilities/hooks';

// Components

const ActivityEngagementComponent = ({ item }) => {
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
            {/* Method */}
            <div>
                <h5 className="mt-16 t-caption-bold text-teal-60">
                    {object.label(
                        'Initiative_Activity__c.Engagement_Method__c'
                    )}
                </h5>
                <p>
                    {getValueLabel(
                        'Initiative_Activity__c.Engagement_Method__c',
                        item?.Engagement_Method__c
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

ActivityEngagementComponent.propTypes = {
    description: t.string,
    location: t.string,
};

ActivityEngagementComponent.defaultProps = {};

export default ActivityEngagementComponent;
