// React
import React from 'react';

// Packages
import t from 'prop-types';

// Components
import Card from 'components/_wizard/card';

const GoalCardComponent = ({ headline, footnote }) => {
    return <Card headline={headline} footnote={footnote} />;
};

GoalCardComponent.propTypes = {
    headline: t.string,
    footnote: t.string,
};

GoalCardComponent.defaultProps = {};

export default GoalCardComponent;
