// React
import React from 'react';

// Packages
import t from 'prop-types';

// Components
import Card from 'components/_wizard/card';

const ListCardComponent = ({ headline, footnote, tags }) => {
    return <Card headline={headline} footnote={footnote} tags={tags} />;
};

ListCardComponent.propTypes = {
    // Card title
    headline: t.string,
    // Text after body text
    footnote: t.string,
    // Tags shown in bottom
    tags: t.arrayOf(t.string),
};

ListCardComponent.defaultProps = {};

export default ListCardComponent;
