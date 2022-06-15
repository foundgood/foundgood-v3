// React
import React from 'react';

// Packages
import t from 'prop-types';

const EmptyStateComponent = ({ label }) => {
    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div className="flex flex-col items-center justify-center p-16 space-y-16 bg-teal-20 rounded-8">
            <p className="text-teal-100 t-sh5">{label}</p>
        </div>
    );
};

EmptyStateComponent.propTypes = {
    text: t.string,
};

EmptyStateComponent.defaultProps = {
    text: '',
};

export default EmptyStateComponent;
