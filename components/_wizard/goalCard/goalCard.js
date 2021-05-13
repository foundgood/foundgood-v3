// React
import React from 'react';

// Packages
import t from 'prop-types';

// Components
import Card from 'components/_wizard/card';

const GoalCardComponent = ({ headline, footnote, action }) => {
    return <Card headline={headline} footnote={footnote} action={action} />;
};

GoalCardComponent.propTypes = {
    headline: t.string,
    footnote: t.string,
    action: t.func,
};

GoalCardComponent.defaultProps = {};

export default GoalCardComponent;
