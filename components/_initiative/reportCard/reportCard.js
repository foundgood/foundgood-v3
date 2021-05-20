// React
import React from 'react';

// Packages
import Link from 'next/link';
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
    const { label } = useMetadata();
    const tempUrl = '/initiative/reports/a101x000002pIiFAAU';

    // Status:
    // - Published
    // - In review
    // - Not started
    // - In progress
    return (
        <Link href={tempUrl}>
            <div
                className={cc([
                    'flex-none w-[220px] p-16 mt-16 mr-16 rounded-8 flex flex-col items-start cursor-pointer',
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
                        { 'bg-coral-20': status == 'Not started' },
                        { 'bg-amber-20': status == 'In progress' },
                        { 'bg-teal-20': status == 'In review' },
                        { 'bg-blue-20': status == 'Published' },
                    ])}>
                    {status}
                </div>
                <div className="mt-8 text-teal-100 t-h5">{headline}</div>
                <div className="text-teal-60 t-sh6">
                    {status == 'Published' ? 'Sent ' : 'Due '}
                    {date}
                </div>
                <div className="self-end mt-16">
                    <Button
                        theme="teal"
                        variant="quaternary"
                        action={actionUpdate}>
                        {label('custom.FA_ButtonUpdate')}
                    </Button>
                </div>
            </div>
        </Link>
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
