// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Utilities
import { useInitiativeDataStore } from 'utilities/store';

// Components

const InputWrapperComponent = ({ children }) => {
    // Stores
    const { utilities } = useInitiativeDataStore();

    // Preload
    const preload = !utilities.initiative.get().Id;

    return (
        <div
            style={{ willChange: 'transform opacity' }}
            className={cc([
                'flex flex-col space-y-36 transition-slow transform pb-32',
                {
                    'opacity-0 translate-y-48': preload,
                    'opacity-100 translate-y-0': !preload,
                },
            ])}>
            {children}
        </div>
    );
};

InputWrapperComponent.propTypes = {
    preload: t.bool,
};

InputWrapperComponent.defaultProps = {
    preload: false,
};

export default InputWrapperComponent;
