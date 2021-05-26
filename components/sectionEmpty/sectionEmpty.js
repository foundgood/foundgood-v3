// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Components
import SectionWrapper from 'components/sectionWrapper';

const SectionEmptyComponent = ({ headline, type }) => {
    // Hook: Metadata
    const { labelTodo, label } = useMetadata();
    return (
        <>
            {headline && (
                <SectionWrapper>
                    <h4 className="t-h5">{headline}</h4>
                </SectionWrapper>
            )}
            <div
                className={cc([
                    'p-16 text-center bg-white border-4 t-body border-teal-20 rounded-8',
                    {
                        'mt-16': !headline,
                    },
                ])}>
                {type == 'initiative' &&
                    label('custom.FA_InitiativeEmptyState')}
                {type == 'report' && label('custom.FA_ReportEmptyState')}
            </div>
        </>
    );
};

SectionEmptyComponent.propTypes = {
    type: t.string.isRequired,
    headline: t.string,
};

SectionEmptyComponent.defaultProps = {};

export default SectionEmptyComponent;
