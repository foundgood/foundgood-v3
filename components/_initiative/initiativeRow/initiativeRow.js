// React
import React from 'react';

// Packages
import Link from 'next/link';
import Image from 'next/image';
import cc from 'classcat';
import t from 'prop-types';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Icons
import { FiFileText } from 'react-icons/fi';

const InitiativeRowComponent = ({
    initiativeId,
    type,
    funder,
    headline,
    leadFunder,
    status,
    dueData,
}) => {
    // Hook: Metadata
    const { labelTodo, label } = useMetadata();

    return (
        <Link href={`/${initiativeId}/overview`}>
            <a className="flex justify-between p-16 mt-24 bg-white cursor-pointer rounded-8">
                <div className="flex">
                    <div className="relative h-full mr-16 overflow-hidden w-128 rounded-8">
                        <Image
                            src="/images/fg-landscape-1.jpg"
                            layout="fill"
                            objectFit="cover"
                            sizes="256px"
                        />
                    </div>
                    <div>
                        <div className="inline-block px-8 pt-3 pb-1 t-sh6 text-blue-60 bg-blue-20 rounded-4">
                            {type}
                        </div>
                        <div className="mt-8 t-h6 text-blue-60">{funder}</div>
                        <div className="mt-4 t-h5">{headline}</div>
                        <div className="mt-8 t-sh6 text-blue-60">
                            {leadFunder && leadFunder}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-none w-1/4">
                    <div className="p-8 border-4 border-blue-10 rounded-4">
                        <div className="t-sh7">
                            {labelTodo('Next Report deadline')}
                        </div>
                        <div className="t-caption-bold">
                            <span className="mr-8">{dueData}</span>
                            {/* Tag name ?? */}
                            <div className="inline-block px-8 pt-3 pb-1 mt-8 text-white t-sh7 bg-teal-80 rounded-4">
                                {labelTodo('Upcoming')}
                            </div>
                        </div>
                    </div>
                    <div className="p-8 mt-8 border-4 border-blue-10 rounded-4">
                        <div className="t-sh7">
                            {labelTodo('Initiative period')}
                        </div>
                        <div className="t-caption-bold">
                            <div className="inline-block px-8 pt-3 pb-1 mt-8 t-sh7 bg-blue-20 rounded-4">
                                {status}
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </Link>
    );
};

InitiativeRowComponent.propTypes = {
    initiativeId: t.string.isRequired,
    type: t.string.isRequired,
    funder: t.string.isRequired,
    headline: t.string.isRequired,
    leadFunder: t.string,
    status: t.string.isRequired,
    dueDate: t.string.isRequired,
};

InitiativeRowComponent.defaultProps = {};

export default InitiativeRowComponent;