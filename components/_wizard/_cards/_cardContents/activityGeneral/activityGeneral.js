// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useLabels } from 'utilities/hooks';

// Components

const ActivityGeneralComponent = ({ item }) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { dataSet, object } = useLabels();

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
            {/* Location */}
            {[country, otherLocation].some(x => x) && (
                <div>
                    <h5 className="mt-16 t-caption-bold text-teal-60">
                        {object.label(
                            'Initiative_Activity__c.Initiative_Location__c'
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

ActivityGeneralComponent.propTypes = {
    item: t.object,
};

ActivityGeneralComponent.defaultProps = {};

export default ActivityGeneralComponent;
