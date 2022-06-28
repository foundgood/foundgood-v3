// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useLabels } from 'utilities/hooks';

// Components

const ResultsKnowledgeComponent = ({ item }) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { object, getValueLabel } = useLabels();

    // ///////////////////
    // DATA
    // ///////////////////

    const { Description__c, Knowledge_Type__c, URL__c, Availibility__c } = item;

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div className="flex flex-col mb-16 space-y-12">
            {/* Description */}
            <p className="text-teal-60">{Description__c}</p>

            {/* Various Info */}
            {[Knowledge_Type__c, URL__c, Availibility__c].some(x => x) && (
                <div className="flex flex-col p-16 space-y-8 bg-teal-10 rounded-8 t-sh7">
                    {Knowledge_Type__c && (
                        <div className="flex flex-col md:flex-row">
                            <span className="w-4/12 text-teal-60">
                                {object.label(
                                    'Initiative_Results__c.Knowledge_Type__c'
                                )}
                            </span>
                            <span className="text-teal-100">
                                {getValueLabel(
                                    'Initiative_Result__c.Knowledge_Type__c',
                                    Knowledge_Type__c
                                )}
                            </span>
                        </div>
                    )}

                    {URL__c && (
                        <div className="flex flex-col md:flex-row">
                            <span className="w-4/12 text-teal-60">
                                {object.label('Initiative_Results__c.URL__c')}
                            </span>
                            <span className="text-teal-100">{URL__c}</span>
                        </div>
                    )}

                    {Availibility__c && (
                        <div className="flex flex-col md:flex-row">
                            <span className="w-4/12 text-teal-60">
                                {object.label(
                                    'Initiative_Results__c.Availibility__c'
                                )}
                            </span>
                            <span className="text-teal-100">
                                {getValueLabel(
                                    'Initiative_Result__c.Availibility__c',
                                    Availibility__c
                                )}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

ResultsKnowledgeComponent.propTypes = {
    item: t.object,
};

ResultsKnowledgeComponent.defaultProps = {};

export default ResultsKnowledgeComponent;
