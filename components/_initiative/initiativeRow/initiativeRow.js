// React
import React from 'react';

// Packages
import Link from 'next/link';
import Image from 'next/image';
import cc from 'classcat';
import t from 'prop-types';
import dayjs from 'dayjs';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Icons
import { FiFileText } from 'react-icons/fi';

const InitiativeRowComponent = ({
    initiativeId,
    type,
    grantee,
    headline,
    leadFunder,
    otherFunders,
    dueDate,
    image,
    startDate,
    endDate,
}) => {
    // Hook: Metadata
    const { label } = useMetadata();

    return (
        <Link href={`/${initiativeId}/overview`}>
            <a className="flex flex-col justify-between p-16 mt-24 bg-white cursor-pointer md:flex-row rounded-8">
                <div className="flex justify-start">
                    {image && (
                        <div className="relative hidden mr-16 overflow-hidden w-128 h-128 rounded-8 sm:flex">
                            <Image
                                src="/images/fg-landscape-1.jpg"
                                layout="fill"
                                objectFit="cover"
                                sizes="256px"
                            />
                        </div>
                    )}
                    <div>
                        <div className="inline-block px-8 pt-3 pb-1 t-sh7 text-blue-60 bg-blue-20 rounded-4">
                            {type}
                        </div>
                        <div className="mt-8 t-h6 text-blue-60">{grantee}</div>
                        <div className="mt-4 t-h5">{headline}</div>
                        <div className="mt-8 t-sh6 text-blue-60">
                            {leadFunder}{' '}
                            {otherFunders && (
                                <span>
                                    + {otherFunders}{' '}
                                    {label('custom.FA_ReportManagerCardOthers')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-24 space-x-12 md:justify-start md:w-1/4 md:space-y-12 md:flex-col md:space-x-0 md:mt-0">
                    {dueDate && (
                        <div className="p-8 space-y-4 border-4 sm:w-2/5 md:w-auto border-amber-20 rounded-4">
                            <div className="t-sh7 text-teal-60">
                                {label(
                                    'custom.FA_InitiativeManagerCardDeadline'
                                )}
                            </div>
                            <div className="text-teal-100 t-caption-bold">
                                <span className="mr-8">
                                    {dayjs(dueDate).format('DD.MM.YYYY')}
                                </span>
                            </div>
                        </div>
                    )}
                    {startDate && endDate && (
                        <div className="p-8 space-y-4 border-4 sm:w-2/5 md:w-auto border-amber-20 rounded-4">
                            <div className="t-sh7 text-blue-60">
                                {label('custom.FA_InitiativeManagerCardPeriod')}
                            </div>
                            <div className="text-blue-100 t-caption-bold">
                                <span className="mr-8">
                                    {`${dayjs(startDate).format(
                                        'DD.MM.YYYY'
                                    )} - ${dayjs(endDate).format(
                                        'DD.MM.YYYY'
                                    )}`}
                                </span>
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
    dueDate: t.string,
    image: t.string,
    startDate: t.string,
    endDate: t.string,
};

InitiativeRowComponent.defaultProps = {
    image: null,
};

export default InitiativeRowComponent;
