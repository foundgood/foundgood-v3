// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Components
import SectionWrapper from 'components/_report/sectionWrapper';

const ChartCardComponent = ({ items, label }) => {
    const { labelTodo } = useMetadata();
    return (
        <SectionWrapper>
            <div className="p-16 border-4 rounded-8 border-blue-10">
                <div className="text-blue-60 t-sh7">
                    {labelTodo('Primary audiences')}
                </div>

                {items.map((item, index) => (
                    <div
                        key={`i-${index}`}
                        className="flex items-end justify-between mt-16">
                        <div className="pb-10 t-h5">{item.title}</div>
                        <div>
                            <div className="t-caption">{label}</div>
                            <div className="leading-none t-h1">
                                {item.value}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
};

ChartCardComponent.propTypes = {
    // Indicator label (custom indicator or people indicator)
    label: t.string.isRequired,
    // Items
    items: t.arrayOf(
        t.shape({
            title: t.string,
            value: t.string,
        })
    ).isRequired,
};

ChartCardComponent.defaultProps = {};

export default ChartCardComponent;
