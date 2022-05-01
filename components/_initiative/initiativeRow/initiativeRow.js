// React
import React, { useEffect, useState } from 'react';

// Packages
import Link from 'next/link';
import Image from 'next/image';
import cc from 'classcat';
import t from 'prop-types';
import dayjs from 'dayjs';

// Utilities
import { useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Icons
import { FiActivity } from 'react-icons/fi';

const InitiativeRowComponent = ({
    initiativeId,
    type,
    grantee,
    headline,
    leadFunder,
    otherFunders,
    image,
    startDate,
    endDate,
    reports,
}) => {
    // Hook: Metadata
    const { label } = useLabels();

    // State: Reports
    const [sortedReports, setSortedReports] = useState([]);

    // Hook: Initiative
    const { reset: resetInitiative } = useInitiativeDataStore();

    // Effect: Make report date data
    useEffect(() => {
        if (Array.isArray(reports)) {
            setSortedReports(
                reports
                    .sort(
                        (a, b) =>
                            new Date(a.Due_Date__c) - new Date(b.Due_Date__c)
                    )
                    .filter(
                        report =>
                            report.Status__c !== 'Published' &&
                            report.Status__c !== 'In review'
                    )
                    .map(report => {
                        const dueDate = dayjs(report.Due_Date__c).format(
                            'DD.MM.YYYY'
                        );
                        const overdue = dayjs(report.Due_Date__c).isBefore(
                            dayjs()
                        );
                        const overdueDays = dayjs(dayjs()).diff(
                            report.Due_Date__c,
                            'day'
                        );
                        return {
                            ...report,
                            dueDate,
                            overdue,
                            overdueDays,
                        };
                    })
                    .filter(report => report.overdueDays < 120)
            );
        }
    }, [reports]);

    // Next report dates etc.
    const nextReport = sortedReports[0] ?? null;

    return (
        <Link href={`/${initiativeId}/overview`}>
            <a
                onClick={resetInitiative}
                className="flex flex-col justify-between p-16 mt-24 bg-white cursor-pointer md:flex-row rounded-8">
                <div className="flex justify-start">
                    {image ? (
                        <div className="relative flex-shrink-0 hidden overflow-hidden w-128 h-128 rounded-8 sm:flex">
                            <Image
                                src={image}
                                layout="fill"
                                objectFit="cover"
                                sizes="256px"
                            />
                        </div>
                    ) : (
                        <div className="items-center justify-center flex-shrink-0 hidden w-128 h-128 bg-blue-10 rounded-8 sm:flex">
                            <FiActivity className="w-48 h-48" />
                        </div>
                    )}
                    <div className="ml-16">
                        <div className="inline-block px-8 pt-3 pb-1 t-sh7 text-blue-60 bg-blue-20 rounded-4">
                            {type}
                        </div>
                        <div className="mt-8 t-h6 text-blue-60">{grantee}</div>
                        <div className="mt-4 t-h5">{headline}</div>
                        <div className="mt-8 t-sh6 text-blue-60">
                            {leadFunder}{' '}
                            {otherFunders > 0 && (
                                <span>
                                    + {otherFunders}{' '}
                                    {label('ReportManagerCardOthers')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end flex-shrink-0 mt-24 space-x-12 md:justify-start md:w-1/4 md:space-y-12 md:flex-col md:space-x-0 md:mt-0">
                    {nextReport && (
                        <div className="p-8 space-y-4 border-4 sm:w-2/5 md:w-auto border-amber-20 rounded-4">
                            <div className="t-sh7 text-teal-60">
                                {label('InitiativeManagerCardDeadline')}
                                <span className="px-6 pt-3 pb-1 ml-4 t-sh7 text-teal-60 bg-teal-10 rounded-4">
                                    {nextReport.Report_Type__c}
                                </span>
                            </div>
                            <div
                                className={cc([
                                    't-caption-bold',
                                    {
                                        'text-teal-100': !nextReport.overdue,
                                        'text-coral-100': nextReport.overdue,
                                    },
                                ])}>
                                <span className="mr-8">
                                    {nextReport.dueDate}
                                    {nextReport.overdue && (
                                        <span className="px-6 pt-3 pb-1 ml-4 t-sh7 text-coral-100 bg-coral-20 rounded-4">
                                            {label('InitiativeManagerCardDue')}
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>
                    )}
                    {startDate && endDate && (
                        <div className="p-8 space-y-4 border-4 sm:w-2/5 md:w-auto border-amber-20 rounded-4">
                            <div className="t-sh7 text-blue-60">
                                {label('InitiativeManagerCardPeriod')}
                            </div>
                            <div className="text-blue-100 t-caption-bold">
                                <span className="mr-8">{`${dayjs(
                                    startDate
                                ).format('DD.MM.YYYY')} - ${dayjs(
                                    endDate
                                ).format('DD.MM.YYYY')}`}</span>
                            </div>
                        </div>
                    )}
                </div>
            </a>
        </Link>
    );
};

InitiativeRowComponent.propTypes = {
    initiativeId: t.string,
    type: t.string,
    grantee: t.string,
    headline: t.string,
    leadFunder: t.string,
    otherFunders: t.number,
    status: t.string,
    image: t.string,
    startDate: t.string,
    endDate: t.string,
    reports: t.array,
};

InitiativeRowComponent.defaultProps = {
    image: null,
};

export default InitiativeRowComponent;
