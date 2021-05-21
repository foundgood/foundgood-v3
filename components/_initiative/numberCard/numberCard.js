// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

const NumberCardComponent = ({
    number,
    headline,
    description,
    useBackground,
}) => {
    return (
        //
        <div
            className={cc([
                'p-16 rounded-4',
                {
                    'border-blue-10 border-4': !useBackground,
                    'bg-blue-10': useBackground,
                },
            ])}>
            <div className="text-blue-100 t-h1">{number}</div>
            <div className="text-blue-60 t-footnote-bold">{headline}</div>
            <div className="text-blue-60 t-footnote">{description}</div>
        </div>
    );
};

NumberCardComponent.propTypes = {
    // Number
    number: t.oneOfType([t.string, t.number]).isRequired,
    // Card title
    headline: t.string,
    // Card description
    description: t.string,
};

NumberCardComponent.defaultProps = {};

export default NumberCardComponent;
