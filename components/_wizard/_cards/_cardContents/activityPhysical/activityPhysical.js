// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components

const ActivityPhysicalComponent = ({ item }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities } = useInitiativeDataStore();

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

    const regulations = utilities.activityRegulations.getFromActivityId(
        item?.id
    );

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div className="flex flex-col mb-16 space-y-12">
            {/* Stage */}
            <div>
                <h5 className="mt-16 t-caption-bold text-teal-60">
                    {object.label(
                        'Initiative_Activity__c.Implementation_Stage__c'
                    )}
                </h5>
                <p className="inline-block px-8 pt-3 pb-1 mt-4 text-teal-100 t-sh7 rounded-4 bg-teal-20">
                    {getValueLabel(
                        'Initiative_Activity__c.Implementation_Stage__c',
                        item?.Implementation_Stage__c
                    )}
                </p>
            </div>

            {/* Value */}
            <div>
                <h5 className="mt-16 t-caption-bold text-teal-60">
                    {object.label('Initiative_Activity__c.Financial_Value__c')}
                </h5>
                <p>{`${item?.CurrencyIsoCode} ${item?.Financial_Value__c}`}</p>
            </div>

            {/* Description */}
            <p className="text-teal-60">{item?.Things_To_Do_Description__c}</p>

            {/* Regulations */}
            {regulations.length > 0 && (
                <div>
                    <h5 className="mt-16 t-caption-bold text-teal-60">
                        {object.label('Initiative_Activity_Regulation__c.Name')}
                    </h5>
                    {regulations.map(x => (
                        <div
                            key={x.Id}
                            className="flex justify-between p-16 mt-8 border-2 border-teal-20 rounded-8">
                            <div className="flex flex-col mt-4">
                                <span className="t-sh6">
                                    {getValueLabel(
                                        'Initiative_Activity_Regulation__c.Type__c',
                                        x?.Type__c
                                    )}
                                </span>
                                <span className="t-h5">{x?.Name}</span>
                            </div>
                            <div className="flex flex-col mt-4">
                                <span className="t-sh6">
                                    {object.label(
                                        'Initiative_Activity_Regulation__c.Importance__c'
                                    )}
                                </span>
                                <span className="self-end inline-block px-8 pt-3 pb-1 text-teal-100 t-sh7 rounded-4 bg-teal-20">
                                    {getValueLabel(
                                        'Initiative_Activity_Regulation__c.Importance__c',
                                        x?.Importance__c
                                    )}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

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
        </div>
    );
};

ActivityPhysicalComponent.propTypes = {
    item: t.object,
};

ActivityPhysicalComponent.defaultProps = {};

export default ActivityPhysicalComponent;
