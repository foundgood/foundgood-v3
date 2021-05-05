// React
import React from 'react';

// Packages
import t from 'prop-types';

// Components
import Card from 'components/_wizard/card';

const OutcomeCardComponent = ({ relatedGoals, body }) => {
    return <Card body={body} relatedGoals={relatedGoals} />;
};

OutcomeCardComponent.propTypes = {
    // Card title
    headline: t.string,
    // Body text
    body: t.string,
};

OutcomeCardComponent.defaultProps = {};

export default OutcomeCardComponent;
