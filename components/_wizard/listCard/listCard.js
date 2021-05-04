// React
import React from 'react';

// Packages
import t from 'prop-types';

// Components
import Card from 'components/_wizard/card';

const ListCardComponent = ({ headline, body }) => {
    return <Card headline={headline} body={body} />;
};

ListCardComponent.propTypes = {
    // Card title
    headline: t.string,
    // Body text
    body: t.string,
};

ListCardComponent.defaultProps = {};

export default ListCardComponent;
