// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Components
import { Number, InputWrapper } from 'components/_inputs';

const ProgressCardComponent = ({ headline, items, controller }) => {
    // Hook: Metadata
    const { labelTodo } = useMetadata();
    return controller ? (
        <div className="p-16 max-w-[600px] rounded-8 bg-teal-10 text-teal-100">
            {headline && <h4 className="t-sh4">{headline}</h4>}
            {items && (
                <div className="flex flex-col">
                    {items.map((item, index) => (
                        <div
                            key={`i-${index}`}
                            className="flex justify-between p-16 mt-16 bg-white rounded-8">
                            <div className="mr-16">
                                <div className="text-teal-60 t-sh6">
                                    {item.label}
                                </div>
                                <div className="text-teal-100 t-h5">
                                    {item.headline}
                                </div>
                                <div className="text-teal-60 t-caption">
                                    {labelTodo('Currently')} {item.currently}
                                </div>
                            </div>

                            <div>
                                <InputWrapper>
                                    <Number
                                        name={item.id}
                                        subLabel={labelTodo(
                                            'Additional reached'
                                        )}
                                        placeholder="0"
                                        controller={controller}
                                    />
                                </InputWrapper>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    ) : null;
};

ProgressCardComponent.propTypes = {
    // Card title
    headline: t.string,
    // Progress Cards
    items: t.arrayOf(
        t.shape({
            label: t.string,
            headline: t.string,
            value: t.any, //number, // Default number input value
        })
    ),
    controller: t.object,
};

ProgressCardComponent.defaultProps = {};

export default ProgressCardComponent;
