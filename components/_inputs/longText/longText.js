// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { Controller } from 'react-hook-form';

// Utilities
import { useLabels } from 'utilities/hooks';

const LongTextComponent = ({
    name,
    label,
    subLabel,
    placeholder,
    defaultValue,
    maxLength,
    controller,
    required,
    setValue,
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
                    <textarea
                        ref={ref}
                        defaultValue={defaultValue}
                        maxLength={maxLength}
                        placeholder={
                            placeholder ||
                            metadataLabel('FormCaptureTextEntryEmpty')
                        }
                        onChange={event => {
                            // Local value state
                            setLengthValue(event.target.value.length);
                            onChange(event);
                        }}
                        className={cc([
                            'input-defaults',
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
                <div className="mt-4 -mb-16 text-right input-utility-text">
                    {lengthValue} / {maxLength.toString()}
                </div>
            )}
        </label>
    );
};

LongTextComponent.propTypes = {
    name: t.string,
    label: t.string,
    subLabel: t.string,
    defaultValue: t.string,
    error: t.object,
    maxLength: t.number,
    required: t.bool,
};

LongTextComponent.defaultProps = {
    maxLength: null,
    required: false,
    setValue() {},
};

export default LongTextComponent;
