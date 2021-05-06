// React
import React from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import t from 'prop-types';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Components
import { Text, InputWrapper } from 'components/_inputs';

const ProgressCardComponent = ({ headline, items }) => {
    // Hook: Metadata
    const { labelTodo } = useMetadata();

    // Hook: useForm setup
    const { register, handleSubmit, control } = useForm();

    // Hook: useForm state
    const { errors } = useFormState({ control });

    return (
        <div className="p-16 max-w-[600px] rounded-8 bg-teal-10 text-teal-100">
            {headline && <h4 className="t-sh4">{labelTodo(headline)}</h4>}
            {items && (
                <div className="flex flex-col">
                    {items.map((item, index) => (
                        <div
                            key={`i-${index}`}
                            className="flex justify-between p-16 mt-16 bg-white rounded-8">
                            <div>
                                <div className="text-teal-60 t-sh6">
                                    {labelTodo(item.label)}
                                </div>
                                <div className="text-teal-100 t-h5">
                                    {labelTodo(item.headline)}
                                </div>
                            </div>

                            <div>
                                <InputWrapper>
                                    <Text
                                        name={`i-${index}`}
                                        subLabel="Reached so far"
                                        placeholder="0"
                                        controller={control}
                                        defaultValue={item.value.toString()} // Numbers not working?
                                    />
                                </InputWrapper>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
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
};

ProgressCardComponent.defaultProps = {};

export default ProgressCardComponent;
