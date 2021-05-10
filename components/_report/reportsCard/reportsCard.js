// React
import React from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import t from 'prop-types';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Components
import Button from 'components/button';
import ReportCard from 'components/_wizard/reportCard';
import { Text, InputWrapper } from 'components/_inputs';
// Icon
import { FiFileText } from 'react-icons/fi';

const ReportsCardComponent = ({ headline, items }) => {
    // Hook: Metadata
    const { labelTodo } = useMetadata();

    // Hook: useForm setup
    const { register, handleSubmit, control } = useForm();

    // Hook: useForm state
    const { errors } = useFormState({ control });

    return (
        <div className="p-16 max-w-[600px] rounded-8 bg-teal-10 text-teal-100">
            <div className="flex justify-between">
                {headline && (
                    <div className="flex items-center">
                        <h4 className="t-sh4">{labelTodo(headline)}</h4>
                    </div>
                )}
                <Button theme="teal" variant="primary">
                    {labelTodo('Add report')}
                </Button>
            </div>
            {items && (
                <div className="flex flex-wrap items-start">
                    {items.map((item, index) => (
                        <ReportCard
                            key={`i-${index}`}
                            headline={item.headline}
                            date={item.date}
                            status={item.status}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

ReportsCardComponent.propTypes = {
    // Card title
    headline: t.string,
    // Report Cards
    items: t.arrayOf(
        t.shape({
            headline: t.string,
            dueDate: t.string, // Do we get Date or String from Salesforce?
        })
    ),
};

ReportsCardComponent.defaultProps = {};

export default ReportsCardComponent;
