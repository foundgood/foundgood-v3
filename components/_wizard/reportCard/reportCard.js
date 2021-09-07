// React
import React from 'react';

// Packages
import t from 'prop-types';
import { useForm, useFormState } from 'react-hook-form';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Components
import Button from 'components/button';

// Icon
import { FiFileText } from 'react-icons/fi';

const ReportCardComponent = ({
    headline,
    items,
    actionCreate,
    actionUpdate,
    disableCreate,
    disableUpdate,
}) => {
    // Hook: Metadata
    const { label } = useMetadata();

    return (
        <div className="p-16 max-w-[600px] rounded-8 bg-teal-10 text-teal-100">
            <div className="flex justify-between mb-32">
                {headline && (
                    <div className="flex items-center">
                        <h4 className="t-sh4">
                            {label('custom.FA_InitiativeViewReportsText')}{' '}
                            {headline}
                        </h4>
                    </div>
                )}
                {!disableCreate && (
                    <Button
                        theme="teal"
                        variant="primary"
                        action={actionCreate}>
                        {label('custom.FA_ButtonAddReport')}
                    </Button>
                )}
            </div>
            {items?.length > 0 && (
                <div className="inline-grid items-start grid-cols-1 gap-24 md:grid-cols-2">
                    {items.map((item, index) => (
                        <div
                            key={`i-${index}`}
                            className="flex flex-col items-start justify-between w-[220px] p-16 bg-white rounded-8">
                            <div className="flex-none w-48 h-48 mb-64">
                                <FiFileText className="w-full h-full" />
                            </div>
                            <div className="text-teal-100 t-h5">
                                {item.headline}
                            </div>
                            <div className="text-teal-60 t-sh6">
                                {item.dueDate}
                            </div>
                            <div className="self-end mt-16">
                                {!disableUpdate && (
                                    <Button
                                        theme="teal"
                                        variant="quaternary"
                                        action={() => actionUpdate(item)}>
                                        {label('custom.FA_Update')}
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

ReportCardComponent.propTypes = {
    // Card title
    headline: t.string,
    // Report Cards
    items: t.arrayOf(
        t.shape({
            id: t.string,
            headline: t.string,
            dueDate: t.string,
        })
    ),
    disableCreate: t.bool,
};

ReportCardComponent.defaultProps = {
    disableCreate: false,
};

export default ReportCardComponent;
