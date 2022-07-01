// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components

const EmployeesFundedComponent = ({ item }) => {
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

    const gender = `${getValueLabel(
        'Initiative_Employee__c.Gender__c',
        item?.Gender__c
    )}${item?.Gender_Other__c ? ` (${item?.Gender_Other__c})` : ''}`;

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div className="flex flex-col mb-16 space-y-12">
            {/* Job title */}
            <div>
                <h5 className="mt-16 t-caption-bold text-teal-60">
                    {object.label('Initiative_Employee__c.Job_Title__c')}
                </h5>
                <p>{item?.Job_Title__c}</p>
            </div>

            {/* Role */}
            <div>
                <h5 className="mt-16 t-caption-bold text-teal-60">
                    {object.label('Initiative_Employee__c.Role_Type__c')}
                </h5>
                <p className="inline-block px-8 pt-3 pb-1 mt-4 text-teal-100 t-sh7 rounded-4 bg-teal-20">
                    {item?.Role_Type__c}
                </p>
            </div>

            {/* Gender */}
            {item?.Gender__c && (
                <div>
                    <h5 className="mt-16 t-caption-bold text-teal-60">
                        {object.label('Initiative_Employee__c.Gender__c')}
                    </h5>
                    <p>{gender}</p>
                </div>
            )}

            {/* Education */}
            {item?.Education__c && (
                <div>
                    <h5 className="mt-16 t-caption-bold text-teal-60">
                        {object.label('Initiative_Employee__c.Education__c')}
                    </h5>
                    <p>{item?.Education__c}</p>
                </div>
            )}

            {/* Education details */}
            {item?.Education_Details__c && (
                <div>
                    <h5 className="mt-16 t-caption-bold text-teal-60">
                        {object.label(
                            'Initiative_Employee__c.Education_Details__c'
                        )}
                    </h5>
                    <p>{item?.Education_Details__c}</p>
                </div>
            )}

            {/* Start date / End date  */}
            <div className="flex space-x-16">
                <div className="px-16 py-8 border-2 border-teal-10 rounded-4">
                    <h5 className="mt-16 t-caption-bold text-teal-60">
                        {object.label('Initiative_Employee__c.Start_Date__c')}
                    </h5>
                    <p>{item?.Start_Date__c ? item?.Start_Date__c : '-'}</p>
                </div>

                <div className="px-16 py-8 border-2 border-teal-10 rounded-4">
                    <h5 className="mt-16 t-caption-bold text-teal-60">
                        {object.label('Initiative_Employee__c.End_Date__c')}
                    </h5>
                    <p>{item?.End_Date__c ? item?.End_Date__c : '-'}</p>
                </div>

                <div className="px-16 py-8 border-2 border-teal-10 rounded-4">
                    <h5 className="mt-16 t-caption-bold text-teal-60">
                        {object.label(
                            'Initiative_Employee__c.Percent_Involvement__c'
                        )}
                    </h5>
                    <p>
                        {item?.Percent_Involvement__c
                            ? item?.Percent_Involvement__c
                            : '-'}
                    </p>
                </div>
            </div>
        </div>
    );
};

EmployeesFundedComponent.propTypes = {
    description: t.string,
    location: t.string,
};

EmployeesFundedComponent.defaultProps = {};

export default EmployeesFundedComponent;
