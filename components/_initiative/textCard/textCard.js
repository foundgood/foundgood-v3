// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Components
import SectionWrapper from 'components/sectionWrapper';

const TextCardComponent = ({
    headline,
    body,
    label,
    hasBackground,
    className,
}) => {
    return (
        <SectionWrapper
            className={cc([
                'rounded-8',
                className,
                {
                    'bg-blue-10': hasBackground,
                    'border-4 border-blue-10': !hasBackground,
                },
            ])}>
            <h4 className="t-h5">{headline}</h4>
            {body && <p className="mt-16 t-body">{body}</p>}
            {label && <p className="mt-16 t-caption text-blue-60">{label}</p>}
        </SectionWrapper>
    );
};

TextCardComponent.propTypes = {
    // Card title
    headline: t.string,
    // Card description
    body: t.string,
};

TextCardComponent.defaultProps = {};

export default TextCardComponent;
