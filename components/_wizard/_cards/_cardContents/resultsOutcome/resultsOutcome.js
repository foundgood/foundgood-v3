// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities

// Components

const ResultsOutcomeComponent = ({ item }) => {
    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div className="flex flex-col mb-16 space-y-12">
            {/* Description */}
            <p className="text-teal-60">{item?.Description__c}</p>
        </div>
    );
};

ResultsOutcomeComponent.propTypes = {
    item: t.object,
};

ResultsOutcomeComponent.defaultProps = {};

export default ResultsOutcomeComponent;
