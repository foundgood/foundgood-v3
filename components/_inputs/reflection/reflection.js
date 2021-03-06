// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { Controller } from 'react-hook-form';

// Utilities
import { useLabels } from 'utilities/hooks';

const ReflectionComponent = ({
    name,
    label,
    subLabel,
    defaultValue,
    placeholder,
    maxLength,
    controller,
    required,
    setValue,
    ...rest
}) => {
    // Hook: Metadata
    const { label: metadataLabel } = useLabels();

    // Local state for handling char count
    const [length, setLength] = useState(defaultValue?.length || 0);

    useEffect(() => {
        if (required) {
            document.getElementById(`${name}-textarea`).focus();
        }
    }, [required]);

    return (
        <label className="flex flex-col rounded-4">
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
                        id={`${name}-textarea`}
                        defaultValue={defaultValue}
                        maxLength={maxLength}
                        onChange={event => {
                            // Local value state
                            setLength(event.target.value.length);
                            onChange(event);
                        }}
                        placeholder={
                            placeholder ||
                            metadataLabel('FormCaptureTextEntryEmpty')
                        }
                        className={cc([
                            'input-defaults w-full',
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
                    {length} / {maxLength.toString()}
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
