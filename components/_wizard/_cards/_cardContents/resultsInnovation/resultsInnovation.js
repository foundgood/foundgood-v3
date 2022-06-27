// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useLabels } from 'utilities/hooks';

// Components

const ResultsInnovationComponent = ({ item }) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { object, getValueLabel } = useLabels();

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div className="flex flex-col mb-16 space-y-12">
            {/* Description */}
            <p className="text-teal-60">{item?.Description__c}</p>

            {/* Various Info */}
            <div className="flex flex-col p-16 space-y-8 bg-teal-10 rounded-8 t-sh7">
                {item?.Innovation_Type__c && (
                    <div className="flex flex-col md:flex-row">
                        <span className="w-4/12 text-teal-60">
                            {object.label(
                                'Initiative_Results__c.Innovation_Type__c'
                            )}
                        </span>
                        <span className="text-teal-100">
                            {getValueLabel(
                                'Initiative_Result__c.Innovation_Type__c',
                                item?.Innovation_Type__c
                            )}
                        </span>
                    </div>
                )}

                {item?.Url__c && (
                    <div className="flex flex-col md:flex-row">
                        <span className="w-4/12 text-teal-60">
                            {object.label('Initiative_Results__c.Url__c')}
                        </span>
                        <span className="text-teal-100">{item?.Url__c}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

ResultsInnovationComponent.propTypes = {
    item: t.object,
};

ResultsInnovationComponent.defaultProps = {};

export default ResultsInnovationComponent;
