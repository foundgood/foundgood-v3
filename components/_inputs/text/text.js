// React
import React, { useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

const TextComponent = React.forwardRef(
    (
        { label, subLabel, defaultValue, error, maxLength, onChange, ...rest },
        ref
    ) => {
        // Local state for handling char count
        const [value, setValue] = useState(defaultValue || '');

        return (
            <label className="flex flex-col">
                {label && <span className="input-label">{label}</span>}
                {subLabel && (
                    <span className="mt-8 input-sublabel">{subLabel}</span>
                )}
                <input
                    ref={ref}
                    type="text"
                    defaultValue={defaultValue}
                    maxLength={maxLength ? maxLength : 'none'}
                    onChange={event => {
                        // Local value state
                        setValue(event.target.value);
                        onChange(event);
                    }}
                    className={cc([
                        'input-defaults',
                        {
                            'ring-2 ring-coral-300 bg-coral-10 text-coral-300': error,
                            'mt-16': label,
                        },
                    ])}
                    {...rest}
                />
                {maxLength > 0 && (
                    <div className="mt-4 -mb-16 text-right input-utility-text">
                        {value.length} / {maxLength.toString()}
                    </div>
                )}
            </label>
        );
    }
);

TextComponent.propTypes = {
    name: t.string,
    label: t.string,
    subLabel: t.string,
    defaultValue: t.string,
    error: t.object,
    maxLength: t.number,
};

TextComponent.defaultProps = {
    maxLength: null,
};

export default TextComponent;