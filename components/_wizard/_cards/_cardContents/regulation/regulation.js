// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useLabels } from 'utilities/hooks';

// Components

const EmployeesFundedComponent = ({ item }) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { object } = useLabels();

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div className="flex flex-col mb-16 space-y-12">
            {/* Issuing body */}
            <div>
                <h5 className="mt-16 t-caption-bold text-teal-60">
                    {object.label(
                        'Initiative_Activity_Regulation__c.Issuing_Body__c'
                    )}
                </h5>
                <p>{item?.Issuing_Body__c}</p>
            </div>

            {/* Start date / End date  */}
            <div className="flex space-x-16">
                <div className="px-16 py-8 border-2 border-teal-10 rounded-4">
                    <h5 className="mt-16 t-caption-bold text-teal-60">
                        {object.label(
                            'Initiative_Activity_Regulation__c.Date_Applied__c'
                        )}
                    </h5>
                    <p>{item?.Date_Applied__c ? item?.Date_Applied__c : '-'}</p>
                </div>

                <div className="px-16 py-8 border-2 border-teal-10 rounded-4">
                    <h5 className="mt-16 t-caption-bold text-teal-60">
                        {object.label(
                            'Initiative_Activity_Regulation__c.Date_Received__c'
                        )}
                    </h5>
                    <p>
                        {item?.Date_Received__c ? item?.Date_Received__c : '-'}
                    </p>
                </div>
            </div>

            {/* Importance */}
            <div>
                <h5 className="mt-16 t-caption-bold text-teal-60">
                    {object.label(
                        'Initiative_Activity_Regulation__c.Importance__c'
                    )}
                </h5>
                <p className="inline-block px-8 pt-3 pb-1 mt-4 text-teal-100 t-sh7 rounded-4 bg-teal-20">
                    {item?.Importance__c}
                </p>
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
