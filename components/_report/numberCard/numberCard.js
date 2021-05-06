// React
import React from 'react';

// Packages
import t from 'prop-types';
import Image from 'next/image';

// Components
import SectionWrapper from 'components/_report/sectionWrapper';

const NumberCardComponent = ({ number, headline, description }) => {
    return (
        <div className="p-16 border-4 rounded-4 border-blue-10">
            <div className="text-blue-100 t-h1">{number}</div>
            <div className="text-blue-60 t-sh7">{headline}</div>
            <div className="text-blue-60 t-footnote">{description}</div>
        </div>
    );
};

NumberCardComponent.propTypes = {
    // Number
    number: t.string.isRequired,
    // Card title
    headline: t.string,
    // Card description
    description: t.string,
};

NumberCardComponent.defaultProps = {};

export default NumberCardComponent;
