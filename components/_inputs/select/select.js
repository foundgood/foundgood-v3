// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Icons
import { FiChevronDown } from 'react-icons/fi';

const SelectComponent = React.forwardRef(
    ({ label, subLabel, error, placeholder, options, ...rest }, ref) => {
        return (
            <label className="flex flex-col">
                {label && <span className="input-label">{label}</span>}
                {subLabel && (
                    <span className="mt-8 input-sublabel">{subLabel}</span>
                )}

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
                            'appearance-none flex-grow pr-20',
                            {
                                'ring-2 ring-coral-300 bg-coral-10 text-coral-300': error,
                            },
                        ])}
                        {...rest}>
                        <option default value="" className="hidden">
                            {placeholder}
                        </option>
                        {options.map(option => (
                            <option
                                key={option.value}
                                value={option.value}
                                className="font-normal text-black">
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <FiChevronDown className="absolute right-0 mr-10 pointer-events-none stroke-current" />
                </div>
            </label>
        );
    }
);

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
};

SelectComponent.defaultProps = {
    options: [],
};

export default SelectComponent;
