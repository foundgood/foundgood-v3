// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components

const ActivityTeamEducationComponent = ({ item }) => {
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

    const employees = utilities.activityEmployees.getFromActivityId(item?.Id);

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div className="flex flex-col mb-16 space-y-12">
            {/* Method */}
            <div>
                <h5 className="mt-16 t-caption-bold text-teal-60">
                    {object.label('Initiative_Activity__c.Education_Type__c')}
                </h5>
                <p>
                    {getValueLabel(
                        'Initiative_Activity__c.Education_Type__c',
                        item?.Education_Type__c
                    )}
                </p>
            </div>

            {/* Description */}
            <p className="text-teal-60">{item?.Things_To_Do_Description__c}</p>

            {/* Employees */}
            {employees.length > 0 && (
                <div>
                    <h5 className="mt-16 t-caption-bold text-teal-60">
                        {object.label(
                            'Initiative_Activity_Regulation__c.Employee__c__TeamEducation'
                        )}
                    </h5>
                    <div className="flex flex-col mt-2 space-y-4">
                        {employees.map(x => (
                            <span
                                key={x.Id}
                                className="flex space-x-6 t-sh6 text-teal-80">
                                <span className="ml-6">&bull;</span>
                                <span>
                                    {`${x?.Initiative_Employee_Funded__r?.Full_Name__c} - ${x?.Initiative_Employee_Funded__r?.Job_Title__c}`}
                                </span>
                            </span>
                        ))}
                    </div>
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

ActivityTeamEducationComponent.propTypes = {
    item: t.object,
};

ActivityTeamEducationComponent.defaultProps = {};

export default ActivityTeamEducationComponent;
