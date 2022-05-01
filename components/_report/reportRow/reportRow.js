// React
import React from 'react';

// Packages
import Link from 'next/link';
import t from 'prop-types';
import dayjs from 'dayjs';

// Utilities
import { useLabels } from 'utilities/hooks';

// Icons
import { FiFileText } from 'react-icons/fi';

const ReportRowComponent = ({
    initiativeId,
    reportId,
    funderName,
    funderId,
    type,
    grantee,
    headline,
    status,
    dueDate,
}) => {
    // Hook: Metadata
    const { label } = useLabels();
    return (
        <Link href={`/${initiativeId}/reports/${reportId}`}>
            <a className="flex flex-col justify-between p-16 mt-24 bg-white cursor-pointer md:flex-row rounded-8">
                <div className="flex">
                    <div className="items-center justify-center flex-shrink-0 hidden w-128 h-128 bg-blue-10 rounded-8 sm:flex">
                        <FiFileText className="w-48 h-48" />
                    </div>

                    <div className="flex flex-col ml-16">
                        <div className="t-sh6">{type}</div>
                        <div className="mt-8 t-h6 text-blue-60">{grantee}</div>
                        <div className="mt-4 t-h5">{headline}</div>
                        {funderName && (
                            <div className="mt-8 t-sh6 text-blue-60">
                                {funderName}
                                {funderId && ` • ${funderId}`}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end flex-shrink-0 mt-24 space-x-12 md:justify-start md:w-1/4 md:space-y-12 md:flex-col md:space-x-0 md:mt-0">
                    {dueDate && (
                        <div className="p-8 space-y-4 border-4 sm:w-2/5 md:w-auto border-amber-20 rounded-4">
                            <div className="t-sh7 text-blue-60">
                                {label('ReportManagerCardDeadline')}
                            </div>
                            <div className="text-blue-100 t-caption-bold">
                                <span className="mr-8">
                                    {dayjs(dueDate).format('DD.MM.YYYY')}
                                </span>
                            </div>
                        </div>
                    )}
                    {status && (
                        <div className="p-8 space-y-4 border-4 sm:w-2/5 md:w-auto border-amber-20 rounded-4">
                            <div className="t-sh7 text-blue-60">
                                {label('ReportManagerCardStatus')}
                            </div>
                            <div className="text-teal-100 t-caption-bold">
                                <div className="inline-block px-8 pt-3 pb-1 mt-8 t-sh7 bg-teal-20 rounded-4">
                                    {status}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </a>
        </Link>
    );
};

ReportRowComponent.propTypes = {
    initiativeId: t.string,
    reportId: t.string,
    applicationId: t.string,
    type: t.string,
    grantee: t.string,
    headline: t.string,
    leadFunder: t.string,
    status: t.string,
    dueDate: t.string,
};

ReportRowComponent.defaultProps = {};

export default ReportRowComponent;
