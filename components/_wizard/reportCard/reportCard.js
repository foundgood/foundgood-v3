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
import { clearConfigCache } from 'prettier';

const ReportCardComponent = ({
    headline,
    items,
    actionCreate,
    actionUpdate,
}) => {
    // Hook: Metadata
    const { labelTodo } = useMetadata();

    return (
        <div className="p-16 max-w-[600px] rounded-8 bg-teal-10 text-teal-100">
            <div className="flex justify-between mb-32">
                {headline && (
                    <div className="flex items-center">
                        <h4 className="t-sh4">{labelTodo(headline)}</h4>
                    </div>
                )}
                <Button theme="teal" variant="primary" action={actionCreate}>
                    {labelTodo('Add report')}
                </Button>
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
                                <Button
                                    theme="teal"
                                    variant="quaternary"
                                    action={() => actionUpdate(item)}>
                                    {labelTodo('Update')}
                                </Button>
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
};

ReportCardComponent.defaultProps = {};

export default ReportCardComponent;
