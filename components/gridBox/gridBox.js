// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Utilities

// Components

const GridBox = ({ padding, color, background, children }) => {
    return (
        <>
            <div
                className={cc([
                    'p-16 border-4 rounded-8',
                    {
                        'border-gray-10': color === 'gray',
                        'border-blue-10': color === 'blue',
                        'bg-gray-10': background && color === 'gray',
                        'bg-blue-10': background && color === 'blue',
                        'md:px-32 md:pt-32 md:pb-24': padding,
                    },
                ])}>
                {children}
            </div>
        </>
    );
};

GridBox.propTypes = {
    background: t.bool,
    color: t.oneOf(['gray', 'blue']),
    padding: t.bool,
};

GridBox.defaultProps = {
    background: false,
    color: 'gray',
    padding: false,
};

export default GridBox;
