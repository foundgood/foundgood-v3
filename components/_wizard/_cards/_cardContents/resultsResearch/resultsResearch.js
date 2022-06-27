// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useLabels } from 'utilities/hooks';

// Components

const ResultsResearchComponent = ({ item }) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { object } = useLabels();

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div className="flex flex-col mb-16 space-y-12">
            {/* Description */}
            <p className="text-teal-60">{item?.Description__c}</p>

            {/* Various Info */}
            <div className="flex flex-col p-16 space-y-8 bg-teal-10 rounded-8 t-sh7">
                {item?.Publication_Title__c && (
                    <div className="flex flex-col md:flex-row">
                        <span className="w-4/12 text-teal-60">
                            {object.label(
                                'Initiative_Results__c.Publication_Title__c'
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
                                'Initiative_Results__c.Publication_Type__c'
                            )}
                        </span>
                        <span className="text-teal-100">
                            {item?.Publication_Type__c}
                        </span>
                    </div>
                )}

                {item?.Year__c && (
                    <div className="flex flex-col md:flex-row">
                        <span className="w-4/12 text-teal-60">
                            {object.label('Initiative_Results__c.Year__c')}
                        </span>
                        <span className="text-teal-100">{item?.Year__c}</span>
                    </div>
                )}

                {item?.Publisher__c && (
                    <div className="flex flex-col md:flex-row">
                        <span className="w-4/12 text-teal-60">
                            {object.label('Initiative_Results__c.Publisher__c')}
                        </span>
                        <span className="text-teal-100">
                            {item?.Publisher__c}
                        </span>
                    </div>
                )}

                {item?.URL_c && (
                    <div className="flex flex-col md:flex-row">
                        <span className="w-4/12 text-teal-60">
                            {object.label('Initiative_Results__c.URL_c')}
                        </span>
                        <span className="text-teal-100">{item?.URL_c}</span>
                    </div>
                )}

                {item?.Author__c && (
                    <div className="flex flex-col md:flex-row">
                        <span className="w-4/12 text-teal-60">
                            {object.label('Initiative_Results__c.Author__c')}
                        </span>
                        <span className="text-teal-100">{item?.Author__c}</span>
                    </div>
                )}

                {item?.DOI__c && (
                    <div className="flex flex-col md:flex-row">
                        <span className="w-4/12 text-teal-60">
                            {object.label('Initiative_Results__c.DOI__c')}
                        </span>
                        <span className="text-teal-100">{item?.DOI__c}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

ResultsResearchComponent.propTypes = {
    item: t.object,
};

ResultsResearchComponent.defaultProps = {};

export default ResultsResearchComponent;
