// React
import React from 'react';

// Packages
import t from 'prop-types';

// Components
import Card from 'components/_wizard/card';

const ProjectMemberCardComponent = ({ headline, subHeadline, footnote }) => {
    return (
        <Card
            headline={headline}
            subHeadline={subHeadline}
            footnote={footnote}
        />
    );
};

ProjectMemberCardComponent.propTypes = {
    // Card title
    headline: t.string,
    // Additonal headline
    subHeadline: t.string,
    // Text after body text
    footnote: t.string,
};

ProjectMemberCardComponent.defaultProps = {};

export default ProjectMemberCardComponent;
