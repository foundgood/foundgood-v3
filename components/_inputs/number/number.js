// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { Controller } from 'react-hook-form';

const NumberComponent = ({
    name,
    label,
    subLabel,
    defaultValue,
    maxValue,
    minValue,
    controller,
    required,
    ...rest
}) => {
    return (
        <label className="flex flex-col">
            {label && <span className="input-label">{label}</span>}
            {subLabel && (
                <span className="mt-8 input-sublabel">{subLabel}</span>
            )}
            <Controller
                control={controller}
                defaultValue={defaultValue}
                name={name}
                rules={{
                    required,
                    pattern: /^(0|[1-9][0-9]*)$/,
                    min: minValue,
                    max: maxValue,
                }}
                render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                }) => (
                    <>
                        <input
                            ref={ref}
                            type="tel"
                            defaultValue={defaultValue}
                            onChange={event => {
                                // Local value state
                                onChange(event);
                            }}
                            className={cc([
                                'input-defaults appearance-none',
                                {
                                    'input-defaults-error': error,
                                    'mt-16': label,
                                },
                            ])}
                            {...rest}
                        />
                    </>
                )}
            />
        </label>
    );
};

NumberComponent.propTypes = {
    name: t.string,
    label: t.string,
    subLabel: t.string,
    defaultValue: t.string,
    error: t.object,
    required: t.bool,
    minValue: t.number,
    maxValue: t.number,
};

NumberComponent.defaultProps = {
    required: false,
    minValue: 0,
    maxValue: null,
};

export default NumberComponent;
