// React
import React from 'react';

// Packages
import t from 'prop-types';

// Components
import Card from 'components/_wizard/card';

const CollaboratorCardComponent = ({
    headline,
    body,
    image,
    label,
    action,
}) => {
    return (
        <Card
            headline={headline}
            label={label}
            body={body}
            image={image}
            action={action}
        />
    );
};

CollaboratorCardComponent.propTypes = {
    // Card title
    headline: t.string,
    // Next to headline
    label: t.string,
    // Body text
    body: t.string,
    // Image url
    image: t.string,
    // Action for button
    action: t.func,
};

CollaboratorCardComponent.defaultProps = {};

export default CollaboratorCardComponent;
