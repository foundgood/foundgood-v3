// React
import React from 'react';

// Packages
import t from 'prop-types';

// Components
import Card from 'components/_wizard/card';

const EvaluationCardComponent = ({ body, evaluator }) => {
    return <Card body={body} evaluator={evaluator} />;
};

EvaluationCardComponent.propTypes = {
    body: t.string,
    evaluator: t.string,
};

EvaluationCardComponent.defaultProps = {};

export default EvaluationCardComponent;
