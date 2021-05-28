// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Utilities

// Components

const InputWrapperComponent = ({ children, preload }) => {
    return (
        <div
            style={{ willChange: 'transform opacity' }}
            className={cc([
                'flex flex-col space-y-48 transition-slow transform pb-32',
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
