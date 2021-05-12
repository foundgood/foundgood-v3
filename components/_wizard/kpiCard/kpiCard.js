// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Components
import Button from 'components/button';

const KpiCardComponent = ({ headline, items, actionCreate, actionUpdate }) => {
    // Hook: Metadata
    const { labelTodo } = useMetadata();

    return (
        <div className="p-16 max-w-[600px] rounded-8 bg-teal-10 text-teal-100">
            <div className="flex justify-between">
                {headline && (
                    <div className="flex items-center">
                        <h4 className="t-sh4">{headline}</h4>
                    </div>
                )}
                <Button theme="teal" variant="quaternary" action={actionCreate}>
                    {labelTodo('Add indicator')}
                </Button>
            </div>
            {items?.length > 0 && (
                <div className="flex flex-col">
                    {items.map((item, index) => (
                        <div
                            key={`i-${index}`}
                            className="flex justify-between p-16 mt-16 bg-white rounded-8">
                            <div>
                                <div className="text-teal-60 t-sh6">
                                    {item.label}
                                </div>
                                <div className="text-teal-100 t-h5">
                                    {item.headline}
                                </div>
                            </div>
                            <Button
                                theme="teal"
                                variant="secondary"
                                action={actionUpdate}>
                                {labelTodo('Update')}
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

KpiCardComponent.propTypes = {
    // Card title
    headline: t.string,
    // KPI Cards
    items: t.arrayOf(
        t.shape({
            label: t.string,
            headline: t.string,
        })
    ),
};

KpiCardComponent.defaultProps = {};

export default KpiCardComponent;
