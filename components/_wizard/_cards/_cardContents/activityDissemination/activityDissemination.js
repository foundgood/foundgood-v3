// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components

const ActivityDisseminationComponent = ({ item }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { CONSTANTS } = useInitiativeDataStore();

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
                        'Initiative_Activity__c.Dissemination_Method__c'
                    )}
                </h5>
                <p>
                    {getValueLabel(
                        'Initiative_Activity__c.Dissemination_Method__c',
                        item?.Dissemination_Method__c
                    )}
                </p>
            </div>

            {/* Location */}
            {[country, otherLocation].some(x => x) && (
                <div>
                    <h5 className="mt-16 t-caption-bold text-teal-60">
                        {object.label(
                            'Initiative_Activity__c.Initiative_Location__c__Dissemination'
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

            {/* Journal type */}
            {item?.Dissemination_Method__c ===
                CONSTANTS.ACTIVITIES.ACTIVITY_JOURNAL && (
                <div className="flex flex-col p-16 space-y-8 bg-teal-10 rounded-8 t-sh7">
                    {item?.Publication_Title__c && (
                        <div className="flex flex-col md:flex-row">
                            <span className="w-4/12 text-teal-60">
                                {object.label(
                                    'Initiative_Activity__c.Publication_Title__c'
                                )}
                            </span>
                            <span className="text-teal-100">
                                {item?.Publication_Title__c}
                            </span>
                        </div>
                    )}

                    {item?.Publication_Type__c && (
                        <div className="flex flex-col md:flex-row">
                            <span className="w-4/12 text-teal-60">
                                {object.label(
                                    'Initiative_Activity__c.Publication_Type__c'
                                )}
                            </span>
                            <span className="text-teal-100">
                                {item?.Publication_Type__c}
                            </span>
                        </div>
                    )}

                    {item?.Publication_Year__c && (
                        <div className="flex flex-col md:flex-row">
                            <span className="w-4/12 text-teal-60">
                                {object.label(
                                    'Initiative_Activity__c.Publication_Year__c'
                                )}
                            </span>
                            <span className="text-teal-100">
                                {item?.Publication_Year__c}
                            </span>
                        </div>
                    )}

                    {item?.Publication_Publisher__c && (
                        <div className="flex flex-col md:flex-row">
                            <span className="w-4/12 text-teal-60">
                                {object.label(
                                    'Initiative_Activity__c.Publication_Publisher__c'
                                )}
                            </span>
                            <span className="text-teal-100">
                                {item?.Publication_Publisher__c}
                            </span>
                        </div>
                    )}

                    {item?.Publication_Author__c && (
                        <div className="flex flex-col md:flex-row">
                            <span className="w-4/12 text-teal-60">
                                {object.label(
                                    'Initiative_Activity__c.Publication_Author__c'
                                )}
                            </span>
                            <span className="text-teal-100">
                                {item?.Publication_Author__c}
                            </span>
                        </div>
                    )}

                    {item?.Publication_DOI__c && (
                        <div className="flex flex-col md:flex-row">
                            <span className="w-4/12 text-teal-60">
                                {object.label(
                                    'Initiative_Activity__c.Publication_DOI__c'
                                )}
                            </span>
                            <span className="text-teal-100">
                                {item?.Publication_DOI__c}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

ActivityDisseminationComponent.propTypes = {
    description: t.string,
    location: t.string,
};

ActivityDisseminationComponent.defaultProps = {};

export default ActivityDisseminationComponent;
