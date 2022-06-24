// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Utilities

// Components

const NestedComponent = ({ theme, children }) => {
    // ///////////////////
    // THEMING
    // ///////////////////

    const isBlue = theme === 'blue';
    const isTeal = theme === 'teal';

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div
            className={cc([
                'border-4 flex flex-col space-y-24 rounded-[12px] p-24',
                {
                    'border-teal-20': isTeal,
                    'border-blue-20': isBlue,
                },
            ])}>
            {children}
        </div>
    );
};

NestedComponent.propTypes = {
    name: t.string.isRequired,
    theme: t.oneOf(['teal', 'blue']),
};

NestedComponent.defaultProps = {
    label: '',
    theme: 'teal',
};

export default NestedComponent;
