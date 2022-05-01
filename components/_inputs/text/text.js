// React
import React, { useEffect, useState } from 'react';

// Utilities
import { useLabels } from 'utilities/hooks';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { Controller } from 'react-hook-form';

const TextComponent = ({
    name,
    label,
    subLabel,
    defaultValue,
    maxLength,
    controller,
    required,
    setValue,
    placeholder,
    ...rest
}) => {
    // Hook: Metadata
    const { label: metadataLabel } = useLabels();

    // State: Local length
    const [lengthValue, setLengthValue] = useState(0);

    // Default value
    useEffect(() => {
        if (defaultValue) {
            setValue(name, defaultValue);
            setLengthValue(defaultValue.length);
        }
    }, [defaultValue]);

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
                rules={{ maxLength, required }}
                render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                }) => (
                    <>
                        <input
                            ref={ref}
                            type="text"
                            defaultValue={defaultValue}
                            maxLength={maxLength ? maxLength : 'none'}
                            placeholder={
                                placeholder ||
                                metadataLabel('FormCaptureTextEntryEmpty')
                            }
                            onChange={event => {
                                // Local value state
                                setValue(event.target.value);
                                onChange(event);
                            }}
                            className={cc([
                                'input-defaults',
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
            {maxLength > 0 && (
                <div className="mt-4 -mb-16 text-right input-utility-text">
                    {lengthValue} / {maxLength.toString()}
                </div>
            )}
        </label>
    );
};

TextComponent.propTypes = {
    name: t.string,
    label: t.string,
    subLabel: t.string,
    defaultValue: t.string,
    error: t.object,
    maxLength: t.number,
    required: t.bool,
};

TextComponent.defaultProps = {
    maxLength: null,
    required: false,
    setValue() {},
};

export default TextComponent;
