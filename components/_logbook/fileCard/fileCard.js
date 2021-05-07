// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Components
import Card from 'components/_logbook/card';

const FileCardComponent = ({
    hasBackground,
    summary,
    body,
    date,
    filePath,
    fileName,
    className,
}) => {
    return (
        <Card
            hasBackground={hasBackground}
            summary={summary}
            body={body}
            date={date}
            filePath={filePath}
            fileName={fileName}
            className={className}
        />
    );
};

FileCardComponent.propTypes = {
    // Date - last in each card
    date: t.string.isRequired,
    // Name of file to download
    fileName: t.string.isRequired,
    // Url to file
    filePath: t.string.isRequired,
    // Either white background - Or transparent with grey border
    hasBackground: t.bool,
    // Card summary (in the top)
    summary: t.string,
    // Card body text
    body: t.string,
};

FileCardComponent.defaultProps = {};

export default FileCardComponent;
