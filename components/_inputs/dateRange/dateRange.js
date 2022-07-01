// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { useController } from 'react-hook-form';
import dayjs from 'dayjs';
import 'react-day-picker/lib/style.css';

// Utilities
import { useLabels } from 'utilities/hooks';

const DateRangeComponent = ({
    controller,
    defaultValue,
    disabled,
    label: inputLabel,
    name,
    required,
    subLabel,
    fromLabel,
    toLabel,
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
        defaultValue: defaultValue,
        rules: {
            validate: {
                isDateFrom: v => (v.from ? dayjs(v.from).isValid() : true),
                isDateTo: v => (v.to ? dayjs(v.to).isValid() : true),
                required: v => (required ? !!v.from && !!v.to : true),
            },
        },
    });

    console.log(error);

    // ///////////////////
    // STATE
    // ///////////////////

    const [from, setFrom] = useState(defaultValue.from);
    const [to, setTo] = useState(defaultValue.to);

    // ///////////////////
    // EFFECTS
    // ///////////////////

    useEffect(() => {
        if (defaultValue.from !== from) {
            setFrom(defaultValue.from);
            setTo(defaultValue.to);
        }
    }, [defaultValue]);

    useEffect(() => {
        if (value) {
            setFrom(value.from);
            setTo(value.to);
        }
    }, []);

    // ///////////////////
    // RENDER
    // ///////////////////

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
                            {fromLabel || label('FormCaptureDateRangeFrom')}
                        </span>
                        <DayPickerInput
                            inputProps={{ disabled }}
                            value={from}
                            formatDate={date =>
                                dayjs(date).format('YYYY-MM-DD')
                            }
                            placeholder="yyyy-mm-dd"
                            onDayChange={event => {
                                setFrom(event);
                                onChange({
                                    ...value,
                                    from: event
                                        ? dayjs(event).format('YYYY-MM-DD')
                                        : 'no-date',
                                });
                            }}
                            classNames={{
                                container: cc([
                                    'input-defaults-date ',
                                    {
                                        'input-defaults-date-error': error,
                                    },
                                ]),
                                overlay: 'bg-white mt-12 z-above',
                            }}
                        />
                    </div>
                    <div className="flex flex-col flex-grow">
                        <span className="mb-4 input-utility-text">
                            {toLabel || label('FormCaptureDateRangeTo')}
                        </span>
                        <DayPickerInput
                            inputProps={{ disabled: disabled || !from }}
                            value={to}
                            placeholder="yyyy-mm-dd"
                            formatDate={date =>
                                dayjs(date).format('YYYY-MM-DD')
                            }
                            dayPickerProps={{
                                disabledDays: { before: from },
                            }}
                            onDayChange={event => {
                                setTo(event);
                                onChange({
                                    ...value,
                                    to: event
                                        ? dayjs(event).format('YYYY-MM-DD')
                                        : 'no-date',
                                });
                            }}
                            classNames={{
                                container: cc([
                                    'input-defaults-date transition-default',
                                    {
                                        'pointer-events-none': !from,
                                        'input-defaults-date-error': error,
                                    },
                                ]),
                                overlay: cc([
                                    'bg-white mt-12 z-above',
                                    {
                                        'pointer-events-none opacity-0': !from,
                                    },
                                ]),
                            }}
                        />
                    </div>
                </div>
            </label>
            <style global jsx>
                {`
                    .DayPicker-Day {
                        line-height: 1 !important;
                    }
                `}
            </style>
        </>
    );
};

DateRangeComponent.propTypes = {
    controller: t.object.isRequired,
    defaultValue: t.shape({ from: t.string, to: t.string }),
    disabled: t.bool,
    label: t.string,
    fromLabel: t.string,
    toLabel: t.string,
    name: t.string,
    required: t.bool,
    subLabel: t.string,
};

DateRangeComponent.defaultProps = {
    controller: null,
    defaultValue: {
        from: null,
        to: null,
    },
    disabled: false,
    label: '',
    fromLabel: '',
    toLabel: '',
    name: '',
    required: false,
    subLabel: '',
};

export default DateRangeComponent;
