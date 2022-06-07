// React
import React from 'react';

// Packages
import t from 'prop-types';

const EmptyStateComponent = ({ text, children }) => {
    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div className="flex flex-col items-center justify-center px-16 py-24 space-y-16 bg-teal-20 rounded-8">
            <p className="text-teal-100 t-sh5">{text}</p>
            <div>{children}</div>
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
