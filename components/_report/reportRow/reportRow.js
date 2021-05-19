// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Icons
import { FiFileText } from 'react-icons/fi';

const ReportRowComponent = ({
    type,
    funder,
    headline,
    leadFunder,
    reportId,
    status,
    deadline,
}) => {
    return (
        <div className="flex justify-between p-16 mt-24 bg-white rounded-8">
            <div className="flex">
                <div className="mr-16 p-46 bg-blue-10">
                    <FiFileText className="w-48 h-48" />
                </div>
                <div>
                    <div className="t-sh6 text-blue-60">{type}</div>
                    <div className="mt-8 t-h6 text-blue-60">{funder}</div>
                    <div className="mt-4 t-h5">{headline}</div>
                    <div className="mt-8 t-sh6 text-blue-60">
                        {leadFunder && leadFunder}
                        {' • '}
                        {reportId}
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-none w-1/4">
                <div className="p-8 border-4 border-blue-10 rounded-4">
                    <div className="t-sh7">Deadline</div>
                    <div className="t-caption-bold">
                        <span className="mr-8">{deadline}</span>
                        {/* Tag name ?? */}
                        <div className="inline-block px-8 pt-3 pb-1 mt-8 text-white t-sh7 bg-teal-80 rounded-4">
                            Upcoming
                        </div>
                    </div>
                </div>
                <div className="p-8 mt-8 border-4 border-blue-10 rounded-4">
                    <div className="t-sh7">Status</div>
                    <div className="t-caption-bold">
                        <div className="inline-block px-8 pt-3 pb-1 mt-8 t-sh7 bg-blue-20 rounded-4">
                            {status}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

ReportRowComponent.propTypes = {
    type: t.string.isRequired,
    funder: t.string.isRequired,
    headline: t.string.isRequired,
    leadFunder: t.string,
    reportId: t.string.isRequired,
    status: t.string.isRequired,
    deadline: t.string.isRequired,
};

ReportRowComponent.defaultProps = {};

export default ReportRowComponent;
