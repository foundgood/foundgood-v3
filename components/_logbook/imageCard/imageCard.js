// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Components
import Card from 'components/_logbook/card';

const ImageCardComponent = ({
    hasBackground,
    summary,
    body,
    date,
    image,
    className,
}) => {
    return (
        <Card
            hasBackground={hasBackground}
            summary={summary}
            body={body}
            date={date}
            image={image}
            className={className}
        />
    );
};

ImageCardComponent.propTypes = {
    // Date - last in each card
    date: t.string.isRequired,
    // Image url
    image: t.string.isRequired,
    // Either white background - Or transparent with grey border
    hasBackground: t.bool,
    // Card summary (in the top)
    summary: t.string,
    // Card body text
    body: t.string,
};

ImageCardComponent.defaultProps = {};

export default ImageCardComponent;
