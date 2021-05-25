// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Components
import SectionWrapper from 'components/sectionWrapper';

const SectionEmptyComponent = ({ headline }) => {
    // Hook: Metadata
    const { labelTodo, label } = useMetadata();
    return (
        <>
            {headline && (
                <SectionWrapper>
                    <h4 className="t-h5">{headline}</h4>
                </SectionWrapper>
            )}
            <div className="p-16 text-center bg-white border-4 t-body border-teal-20 rounded-8">
                {labelTodo('Label todo: This section has not been updated. ')}
            </div>
        </>
    );
};

SectionEmptyComponent.propTypes = {};

SectionEmptyComponent.defaultProps = {};

export default SectionEmptyComponent;
