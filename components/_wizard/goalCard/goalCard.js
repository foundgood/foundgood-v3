// React
import React from 'react';

// Packages
import t from 'prop-types';

// Components
import Card from 'components/_wizard/card';

const GoalCardComponent = ({ headline, action }) => {
    return <Card headline={headline} action={action} />;
};

GoalCardComponent.propTypes = {
    headline: t.string,
    footnote: t.string,
    action: t.func,
};

GoalCardComponent.defaultProps = {};

export default GoalCardComponent;
