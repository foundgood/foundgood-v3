// React
import React from 'react';

// Packages
import t from 'prop-types';

// Components
import Card from 'components/_wizard/card';

const ResultCardComponent = ({ headline, footnote, tags = [], action }) => {
    return (
        <Card
            headline={headline}
            footnote={footnote}
            tags={tags}
            action={action}
        />
    );
};

ResultCardComponent.propTypes = {
    // Card title
    headline: t.string,
    // Text after body text
    footnote: t.string,
    // Tags shown in bottom
    tags: t.arrayOf(t.string),
    // Button action
    action: t.func,
};

ResultCardComponent.defaultProps = {};

export default ResultCardComponent;
