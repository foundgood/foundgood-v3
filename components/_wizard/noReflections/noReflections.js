// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Components
import Button from 'components/button';

const NoReflectionsComponent = ({ onClick, show, submitted }) => {
    // Hook: Metadata
    const { label } = useMetadata();

    return show ? (
        submitted ? (
            <div className="flex flex-col p-16 border-4 border-amber-10 bg-amber-10 rounded-8 text-amber-100">
                <h2 className="mb-8 font-bold t-sh4">
                    {label('custom.FA_NothingToReportStatusHeader')}
                </h2>
                <p className="mb-16 t-small">
                    {label('custom.FA_NothingToReportStatusBody')}
                </p>
            </div>
        ) : (
            <div className="flex flex-col p-16 border-4 border-amber-20 rounded-8 text-amber-100">
                <h2 className="mb-8 font-bold t-sh4">
                    {label('custom.FA_NothingToReportPromptHeader')}
                </h2>
                <p className="mb-16 t-small">
                    {label('custom.FA_NothingToReportPromptBody')}
                </p>
                <Button
                    theme="amber"
                    variant="secondary"
                    className="self-end"
                    action={onClick}>
                    {label('custom.FA_ButtonNoUpdates')}
                </Button>
            </div>
        )
    ) : null;
};

NoReflectionsComponent.propTypes = {
    onClick: t.func,
    show: t.bool,
    submitted: t.bool,
};

NoReflectionsComponent.defaultProps = {
    show: false,
    submitted: false,
};

export default NoReflectionsComponent;
