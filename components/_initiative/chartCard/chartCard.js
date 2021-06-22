// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

const ChartCardComponent = ({ items, headline, useBorder }) => {
    console.log(items);
    return (
        <div
            className={cc([
                { 'p-16 border-4 rounded-8 border-blue-10': useBorder },
            ])}>
            {headline && <div className="text-blue-60 t-sh7">{headline}</div>}

            {items.map((item, index) => (
                <div
                    key={`i-${index}`}
                    className="flex items-end justify-between mt-16">
                    <div className="pb-10 t-h5">{item.title}</div>
                    <div>
                        <div className="text-right t-caption">{item.label}</div>
                        <div className="leading-none text-right t-h1">
                            {item.value}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

ChartCardComponent.propTypes = {
    // Items
    items: t.arrayOf(
        t.shape({
            title: t.string,
            value: t.oneOfType([t.string, t.number]),
            label: t.string,
        })
    ).isRequired,
};

ChartCardComponent.defaultProps = {};

export default ChartCardComponent;
