// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

const SectionWrapperComponent = ({
    children,
    className,
    paddingY = true,
    id,
}) => {
    const elementClassNames = cc([
        { 'px-16 md:px-32': !paddingY },
        {
            'px-16 pt-16 pb-12 md:px-32 md:pt-32 md:pb-24': paddingY,
            'offset-anchor': id,
        },
        className,
    ]);
    return (
        <div className={elementClassNames} id={id}>
            {children}
        </div>
    );
};

SectionWrapperComponent.propTypes = {};

SectionWrapperComponent.defaultProps = {};

export default SectionWrapperComponent;
