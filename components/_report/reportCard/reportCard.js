// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Components
import Button from 'components/button';

// Icon
import { FiFileText } from 'react-icons/fi';

const ReportCardComponent = ({
    headline,
    date,
    status,
    useBackground = true,
    actionUpdate,
}) => {
    // Hook: Metadata
    const { labelTodo } = useMetadata();

    // TODO - update to salesforece format

    // Status:
    // - not started
    // - in progress
    // - review
    // - complete
    return (
        <div
            className={cc([
                'flex-none w-[220px] p-16 mt-16 mr-16 rounded-8 flex flex-col items-start',
                {
                    'border-amber-20 border-4': !useBackground,
                    'bg-white': useBackground,
                },
            ])}>
            <div className="flex-none w-48 h-48 mb-64">
                <FiFileText className="w-full h-full" />
            </div>
            <div
                className={cc([
                    'px-8 pt-3 pb-1 rounded-4',
                    { 'bg-coral-20': status == 'not-started' },
                    { 'bg-amber-20': status == 'in-progress' },
                    { 'bg-teal-20': status == 'review' },
                    { 'bg-blue-20': status == 'complete' },
                ])}>
                {status == 'not-started' && 'No started'}
                {status == 'in-progress' && 'In progress'}
                {status == 'review' && 'Review'}
                {status == 'complete' && 'Complete'}
            </div>
            <div className="mt-8 text-teal-100 t-h5">{labelTodo(headline)}</div>
            <div className="text-teal-60 t-sh6">
                {status == 'not-started' && 'Starts'}
                {status == 'in-progress' && 'Due'}
                {status == 'review' && 'Due'}
                {status == 'complete' && 'Sent'}
                {labelTodo(date)}
            </div>
            <div className="self-end mt-16">
                <Button theme="teal" variant="quaternary" action={actionUpdate}>
                    {labelTodo('Update')}
                </Button>
            </div>
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
