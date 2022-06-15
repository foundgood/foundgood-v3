// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useLabels } from 'utilities/hooks';

// Components

const ActivityContentComponent = ({ item }) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label, dataSet } = useLabels();

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
        <div className="flex flex-col">
            <p>{item?.Things_To_Do_Description__c}</p>
            {[country, otherLocation].some(x => x) && (
                <>
                    <h5 className="mt-16 t-caption-bold">
                        {label('CardActivityLocation')}
                    </h5>
                    <p>
                        {otherLocation && otherLocation}
                        {otherLocation && country && `, `}
                        {country && country}
                    </p>
                </>
            )}
        </div>
    );
};

ActivityContentComponent.propTypes = {
    description: t.string,
    location: t.string,
};

ActivityContentComponent.defaultProps = {};

export default ActivityContentComponent;
