// React
import React from 'react';

// Packages
import t from 'prop-types';
import Image from 'next/image';

// Utilities
import { isJson } from 'utilities';

// Components
import SectionWrapper from 'components/_report/sectionWrapper';

const ReportDetailCardComponent = ({ headline, image, description, items }) => {
    return (
        <div className="flex justify-between">
            <div className="mr-24">
                <div className="flex">
                    {image && (
                        <div className="h-24 mr-8 overflow-hidden rounded-4">
                            <Image src={image} width="24" height="24" />
                        </div>
                    )}
                    <div className="t-h6">{headline}</div>
                </div>

                {isJson(description) &&
                    JSON.parse(description).map(item => (
                        <p key={item.id} className="mt-16">
                            {item.text}
                        </p>
                    ))}
                {!isJson(description) && <p className="mt-16">{description}</p>}
            </div>

            {items && (
                <div className="flex flex-col flex-none w-1/3">
                    {items.map((item, index) => (
                        <div
                            key={`i-${index}`}
                            className="p-16 mt-8 border-4 border-blue-10 rounded-4">
                            <div className="t-sh7">{item.label}</div>
                            <div className="t-caption-bold">{item.text}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

ReportDetailCardComponent.propTypes = {
    // Card title
    headline: t.string,
    // Card description
    description: t.string,
    // Image url
    image: t.string,
    // Items
    items: t.arrayOf(
        t.shape({
            label: t.string,
            text: t.string,
        })
    ),
};

ReportDetailCardComponent.defaultProps = {};

export default ReportDetailCardComponent;
