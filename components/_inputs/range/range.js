// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { useController } from 'react-hook-form';

// Utilities
import { useLabels } from 'utilities/hooks';

const RangeComponent = ({
    controller,
    defaultValue,
    disabled,
    label: inputLabel,
    maxValue,
    minValue,
    name,
    placeholder,
    required,
    subLabel,
}) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label } = useLabels();
    const {
        field: { onChange, value },
        fieldState: { error },
    } = useController({
        name,
        control: controller,
        defaultValue,
        rules: {
            validate: {
                isNumberFrom: v =>
                    v.length > 0
                        ? /^(0|[1-9][0-9]*)$/.test(v.from) && v.from < v.to
                        : true,
                isNumberTo: v =>
                    v.length > 0
                        ? /^(0|[1-9][0-9]*)$/.test(v.to) && v.to > v.from
                        : true,
                rangeMin: v => (minValue ? v.from >= minValue : true),
                rangeMax: v => (maxValue ? v.to <= maxValue : true),
                required: v => (required ? !!v.from && !!v.to : true),
            },
        },
    });

    // ///////////////////
    // RENDER
    // ///////////////////
    console.log(error);

    return (
        <>
            <label className="flex flex-col" htmlFor={name}>
                {inputLabel && (
                    <span className="input-label">{inputLabel}</span>
                )}
                {subLabel && (
                    <span className="mt-8 input-sublabel">{subLabel}</span>
                )}
                <div
                    className={cc([
                        'space-x-12 flex',
                        { 'mt-16': inputLabel },
                    ])}>
                    <div className="flex flex-col flex-grow">
                        <span className="mb-4 input-utility-text">
                            {label('FormCaptureDateRangeFrom')}{' '}
                            {typeof minValue === 'number' && `(${minValue})`}
                        </span>
                        <input
                            name={name}
                            type="tel"
                            value={value?.from}
                            required={required}
                            disabled={disabled}
                            onChange={event => {
                                // Opdate value
                                onChange({
                                    from: parseInt(event.target.value, 10),
                                    to: value.to,
                                });
                            }}
                            placeholder={
                                placeholder ||
                                label('FormCaptureTextEntryEmpty')
                            }
                            className={cc([
                                'text-right',
                                'input-defaults appearance-none',
                                {
                                    'input-defaults-error': error,
                                },
                            ])}
                        />
                    </div>
                    <div className="flex flex-col flex-grow">
                        <span className="mb-4 input-utility-text">
                            {label('FormCaptureDateRangeTo')}{' '}
                            {typeof maxValue === 'number' && `(${maxValue})`}
                        </span>
                        <input
                            type="tel"
                            value={value?.to}
                            required={required}
                            onChange={event => {
                                // Opdate value
                                onChange({
                                    from: value.from,
                                    to: parseInt(event.target.value, 10),
                                });
                            }}
                            placeholder={
                                placeholder ||
                                label('FormCaptureTextEntryEmpty')
                            }
                            className={cc([
                                'text-right',
                                'input-defaults appearance-none',
                                {
                                    'input-defaults-error': error,
                                },
                            ])}
                        />
                    </div>
                </div>
            </label>
        </>
    );
};

RangeComponent.propTypes = {
    controller: t.object.isRequired,
    defaultValue: t.shape({ from: t.number, to: t.number }),
    disabled: t.bool,
    label: t.string,
    name: t.string,
    placeholder: t.string,
    required: t.bool,
    subLabel: t.string,
    maxValue: t.number,
    minValue: t.number,
};

RangeComponent.defaultProps = {
    controller: null,
    defaultValue: {
        from: null,
        to: null,
    },
    disabled: false,
    label: '',
    name: '',
    placeholder: '',
    required: false,
    subLabel: '',
    maxValue: null,
    minValue: null,
};

export default RangeComponent;
