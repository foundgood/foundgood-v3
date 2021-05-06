// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

const SectionWrapperComponent = ({ children, className, paddingY = true }) => {
    const elementClassNames = cc([
        { 'px-16 md:px-32 xl:px-64': !paddingY },
        { 'px-16 pt-16 pb-12 md:p-32 md:pt-32 md:pb-24 xl:px-64': paddingY },
        className,
    ]);
    return <div className={elementClassNames}>{children}</div>;
};

SectionWrapperComponent.propTypes = {};

SectionWrapperComponent.defaultProps = {};

export default SectionWrapperComponent;
