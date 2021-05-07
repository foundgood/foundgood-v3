// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Components
import Card from 'components/_logbook/card';

const CardComponent = ({ hasBackground, summary, body, date, className }) => {
    return (
        <Card
            hasBackground={hasBackground}
            summary={summary}
            body={body}
            date={date}
            className={className}
        />
    );
};

CardComponent.propTypes = {
    // Date - last in each card
    date: t.string.isRequired,
    // Either white background - Or transparent with grey border
    hasBackground: t.bool,
    // Card summary (in the top)
    summary: t.string,
    // Card body text
    body: t.string,
};

CardComponent.defaultProps = {};

export default CardComponent;
