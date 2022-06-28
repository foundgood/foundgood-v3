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
    // DATA
    // ///////////////////

    const {
        Description__c,
        Publication_Title__c,
        Publication_Type__c,
        Year__c,
        Publisher__c,
        URL_c,
        Author__c,
        DOI__c,
    } = item;

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div className="flex flex-col mb-16 space-y-12">
            {/* Description */}
            <p className="text-teal-60">{Description__c}</p>

            {/* Various Info */}
            {[
                Publication_Title__c,
                Publication_Type__c,
                Year__c,
                Publisher__c,
                URL_c,
                Author__c,
                DOI__c,
            ].some(x => x) && (
                <div className="flex flex-col p-16 space-y-8 bg-teal-10 rounded-8 t-sh7">
                    {Publication_Title__c && (
                        <div className="flex flex-col md:flex-row">
                            <span className="w-4/12 text-teal-60">
                                {object.label(
                                    'Initiative_Results__c.Publication_Title__c'
                                )}
                            </span>
                            <span className="text-teal-100">
                                {Publication_Title__c}
                            </span>
                        </div>
                    )}

                    {Publication_Type__c && (
                        <div className="flex flex-col md:flex-row">
                            <span className="w-4/12 text-teal-60">
                                {object.label(
                                    'Initiative_Results__c.Publication_Type__c'
                                )}
                            </span>
                            <span className="text-teal-100">
                                {Publication_Type__c}
                            </span>
                        </div>
                    )}

                    {Year__c && (
                        <div className="flex flex-col md:flex-row">
                            <span className="w-4/12 text-teal-60">
                                {object.label('Initiative_Results__c.Year__c')}
                            </span>
                            <span className="text-teal-100">{Year__c}</span>
                        </div>
                    )}

                    {Publisher__c && (
                        <div className="flex flex-col md:flex-row">
                            <span className="w-4/12 text-teal-60">
                                {object.label(
                                    'Initiative_Results__c.Publisher__c'
                                )}
                            </span>
                            <span className="text-teal-100">
                                {Publisher__c}
                            </span>
                        </div>
                    )}

                    {URL_c && (
                        <div className="flex flex-col md:flex-row">
                            <span className="w-4/12 text-teal-60">
                                {object.label('Initiative_Results__c.URL_c')}
                            </span>
                            <span className="text-teal-100">{URL_c}</span>
                        </div>
                    )}

                    {Author__c && (
                        <div className="flex flex-col md:flex-row">
                            <span className="w-4/12 text-teal-60">
                                {object.label(
                                    'Initiative_Results__c.Author__c'
                                )}
                            </span>
                            <span className="text-teal-100">{Author__c}</span>
                        </div>
                    )}

                    {DOI__c && (
                        <div className="flex flex-col md:flex-row">
                            <span className="w-4/12 text-teal-60">
                                {object.label('Initiative_Results__c.DOI__c')}
                            </span>
                            <span className="text-teal-100">{DOI__c}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

ResultsResearchComponent.propTypes = {
    item: t.object,
};

ResultsResearchComponent.defaultProps = {};

export default ResultsResearchComponent;
