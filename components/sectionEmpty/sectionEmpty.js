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
    const { label } = useMetadata();
    return (
        <>
            {headline && (
                <SectionWrapper>
                    <h4 className="t-h5">{headline}</h4>
                </SectionWrapper>
            )}
            <div
                className={cc([
                    'p-16 text-center border-4 t-body  rounded-8',
                    {
                        'mt-16': !headline,
                        'bg-blue-10 border-blue-10': type == 'noReflections',
                        'bg-white border-teal-20': type != 'noReflections',
                    },
                ])}>
                {type == 'initiative' &&
                    label('custom.FA_InitiativeEmptyState')}
                {type == 'report' && label('custom.FA_ReportEmptyState')}
                {type == 'noReflections' &&
                    label('custom.FA_NothingToReportReportView')}
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
