// React
import React from 'react';

// Packages
import t from 'prop-types';

// Components
import Card from 'components/_wizard/card';

const FounderCardComponent = ({
    headline,
    label,
    subHeadline,
    footnote,
    image,
}) => {
    return (
        <Card
            headline={headline}
            label={label}
            subHeadline={subHeadline}
            footnote={footnote}
            image={image}
        />
    );
};

FounderCardComponent.propTypes = {
    // Card title
    headline: t.string,
    // Additonal headline
    subHeadline: t.string,
    // Next to headline
    label: t.string,
    // Image url
    image: t.string,
    // Text after body text
    footnote: t.string,
};

FounderCardComponent.defaultProps = {};

export default FounderCardComponent;
