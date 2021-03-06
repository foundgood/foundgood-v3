// React
import React from 'react';

// Packages
import t from 'prop-types';
import Image from 'next/image';

// Utilities
import { useLabels } from 'utilities/hooks';

const ReportSharingCardComponent = ({ headline, description, tags, items }) => {
    // Hook: Metadata
    // const { label } = useLabels();

    return (
        <div className="flex items-start justify-between">
            <div className="flex-none w-2/3 mr-24">
                <div className="t-h6">{headline}</div>
                <p className="mt-16">{description}</p>
                {items && items.length > 0 && (
                    <div className="px-16 pt-8 pb-16 mt-8 bg-blue-10 rounded-8">
                        {items.map((item, index) => (
                            <div
                                key={`i-${index}`}
                                className="flex justify-between mt-8">
                                <div className="mr-16 text-blue-60 t-sh7">
                                    {item.label}
                                </div>
                                <div className="t-sh7">{item.text}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {tags && (
                <div className="flex flex-col items-start w-1/3 p-16 border-4 border-blue-10 rounded-8">
                    <div className="text-blue-60 t-sh7">
                        {/* {label('ReportViewSharingAudience')} */}
                    </div>
                    {tags.map((tag, index) => (
                        <div
                            key={`t-${index}`}
                            className="px-8 pt-3 pb-1 mt-8 t-sh7 bg-blue-20 rounded-4">
                            {tag}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

ReportSharingCardComponent.propTypes = {
    // Card title
    headline: t.string,
    label: t.string,
    // Tags
    tags: t.arrayOf(t.string),
    // Items
    items: t.arrayOf(
        t.shape({
            label: t.string,
            value: t.string,
        })
    ),
};

ReportSharingCardComponent.defaultProps = {};

export default ReportSharingCardComponent;
