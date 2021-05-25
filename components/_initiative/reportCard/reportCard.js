// React
import React from 'react';

// Packages
import Link from 'next/link';
import cc from 'classcat';
import t from 'prop-types';

// Utilities
import { useMetadata } from 'utilities/hooks';
import { useContext } from 'utilities/hooks';
// Icon
import { FiFileText } from 'react-icons/fi';

const ReportCardComponent = ({
    id,
    headline,
    date,
    status,
    useBackground = true,
}) => {
    // Hook: Context
    const { INITIATIVE_ID } = useContext();

    // Hook: Metadata
    const { label } = useMetadata();
    const url = `/${INITIATIVE_ID}/reports/${id}`;

    return (
        <Link href={url}>
            <a
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
                    {status == 'Published'
                        ? label('custom.FA_InitiativeViewReportSubmitted')
                        : label('custom.FA_InitiativeViewReportDue')}{' '}
                    {date}
                </div>
                {/* <div className="self-end mt-16">
                    <Button
                        theme="teal"
                        variant="quaternary"
                        action={actionUpdate}>
                        {label('custom.FA_Update')}
                    </Button>
                </div> */}
            </a>
        </Link>
    );
};

ReportCardComponent.propTypes = {
    // Report id - used for url
    id: t.string.isRequired,
    // Card title
    headline: t.string,
    // Due/Complete date
    date: t.string,
    // Published, In review, Not started, In progress,
    status: t.string,
    // true/false
    useBackground: t.bool,
};

ReportCardComponent.defaultProps = {};

export default ReportCardComponent;
