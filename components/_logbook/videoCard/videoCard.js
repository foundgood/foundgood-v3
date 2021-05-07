// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Components
import Card from 'components/_logbook/card';

const VideoCardComponent = ({
    hasBackground,
    summary,
    body,
    date,
    video,
    className,
}) => {
    return (
        <Card
            hasBackground={hasBackground}
            summary={summary}
            body={body}
            date={date}
            video={video}
            className={className}
        />
    );
};

VideoCardComponent.propTypes = {
    // Date - last in each card
    date: t.string.isRequired,
    // Video url
    video: t.string.isRequired,
    // Either white background - Or transparent with grey border
    hasBackground: t.bool,
    // Card summary (in the top)
    summary: t.string,
    // Card body text
    body: t.string,
};

VideoCardComponent.defaultProps = {};

export default VideoCardComponent;
