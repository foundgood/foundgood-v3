// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { Controller } from 'react-hook-form';

// Icons
import { FiChevronDown } from 'react-icons/fi';

const SelectComponent = ({
    name,
    label,
    subLabel,
    defaultValue,
    error,
    placeholder,
    options,
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
                rules={{ required }}
                render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                }) => (
                    <div
                        className={cc([
                            'relative flex items-center',
                            {
                                'mt-16': label,
                            },
                        ])}>
                        <select
                            ref={ref}
                            className={cc([
                                'input-defaults',
                                'appearance-none flex-grow pr-20 max-w-full',
                                {
                                    'input-defaults-error': error,
                                },
                            ])}
                            onChange={event => onChange(event)}
                            {...rest}>
                            <option default value="" className="hidden">
                                {placeholder}
                            </option>
                            {options.map((option, index) => (
                                <option
                                    key={`${option.value}-${index}`}
                                    value={option.value}
                                    className="font-normal text-black">
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <FiChevronDown className="absolute right-0 mr-10 pointer-events-none stroke-current" />
                    </div>
                )}
            />
        </label>
    );
};

SelectComponent.propTypes = {
    name: t.string,
    label: t.string,
    defaultValue: t.string,
    error: t.object,
    options: t.arrayOf(
        t.shape({
            label: t.string,
            value: t.oneOfType([t.string, t.number, t.bool]),
        })
    ),
    required: t.bool,
};

SelectComponent.defaultProps = {
    options: [],
    required: false,
};

export default SelectComponent;
