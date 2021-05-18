// React
import React, { useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { Controller } from 'react-hook-form';

const ReflectionComponent = ({
    name,
    label,
    subLabel,
    defaultValue,
    maxLength,
    controller,
    required,
    ...rest
}) => {
    // Local state for handling char count
    const [value, setValue] = useState(defaultValue || '');

    return (
        <label className="flex flex-col p-16 mt-16 rounded-4 bg-teal-10">
            {label && <span className="input-label">{label}</span>}
            {subLabel && (
                <span className="mt-8 input-sublabel">{subLabel}</span>
            )}
            <Controller
                control={controller}
                defaultValue={defaultValue}
                name={name}
                rules={{ maxLength, required }}
                render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                }) => (
                    <textarea
                        ref={ref}
                        defaultValue={defaultValue}
                        maxLength={maxLength}
                        onChange={event => {
                            // Local value state
                            setValue(event.target.value);
                            onChange(event);
                        }}
                        className={cc([
                            'input-defaults !bg-white w-full',
                            '!h-[144px] resize-none',
                            {
                                'input-defaults-error': error,
                                'mt-16': label,
                            },
                        ])}
                        {...rest}
                    />
                )}
            />
            {maxLength > 0 && (
                <div className="mt-6 mb-8 text-right input-utility-text">
                    {value.length} / {maxLength.toString()}
                </div>
            )}
        </label>
    );
};

ReflectionComponent.propTypes = {
    name: t.string,
    label: t.string,
    subLabel: t.string,
    defaultValue: t.string,
    error: t.object,
    maxLength: t.number,
    required: t.bool,
};

ReflectionComponent.defaultProps = {
    maxLength: null,
    required: false,
};

export default ReflectionComponent;
