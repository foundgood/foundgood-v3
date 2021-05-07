// React
import React from 'react';

// Packages
import t from 'prop-types';

// Components
import Card from 'components/_wizard/card';

const ProjectMemberCardComponent = ({ headline, body, label, action }) => {
    return (
        <Card headline={headline} label={label} body={body} action={action} />
    );
};

ProjectMemberCardComponent.propTypes = {
    // Card title
    headline: t.string,
    // Label
    label: t.string,
    // Text after body text
    footnote: t.string,
    // Button action
    action: t.func,
};

ProjectMemberCardComponent.defaultProps = {};

export default ProjectMemberCardComponent;
