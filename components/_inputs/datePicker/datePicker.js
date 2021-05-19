// React
import React, { useState, useEffect } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { useController } from 'react-hook-form';
import dayjs from 'dayjs';
import 'react-day-picker/lib/style.css';

// Utilities

const DatePickerComponent = ({
    controller,
    defaultValue,
    label,
    name,
    subLabel,
    required,
    disabled,
}) => {
    // Local state for handling dates
    const [date, setDate] = useState(defaultValue);

    // Controller from useForm
    const {
        field: { onChange, value },
        fieldState: { error },
    } = useController({
        name,
        control: controller,
        defaultValue: defaultValue,
        rules: {
            required,
            validate: {
                isDate: v => (v ? dayjs(v).isValid() : true),
            },
        },
    });

    // Update state when using setValue
    useEffect(() => {
        if (value) {
            setDate(value);
        }
    }, []);

    return (
        <>
            <label className="flex flex-col" htmlFor={name}>
                {label && <span className="input-label">{label}</span>}
                {subLabel && (
                    <span className="mt-8 input-sublabel">{subLabel}</span>
                )}
                <div className={cc(['space-x-12 flex', { 'mt-16': label }])}>
                    <div className="flex flex-col flex-grow">
                        <DayPickerInput
                            inputProps={{ disabled }}
                            value={date}
                            formatDate={date =>
                                dayjs(date).format('YYYY-MM-DD')
                            }
                            placeholder="yyyy-mm-dd"
                            onDayChange={event => {
                                setDate(event);
                                onChange(
                                    event
                                        ? dayjs(event).format('YYYY-MM-DD')
                                        : 'no-date'
                                );
                            }}
                            classNames={{
                                container: cc([
                                    'input-defaults-date ',
                                    {
                                        'input-defaults-date-error':
                                            error?.type === 'isDate',
                                    },
                                ]),
                                overlay: 'absolute bg-white mt-12 z-above',
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

DatePickerComponent.propTypes = {
    name: t.string,
    label: t.string,
    subLabel: t.string,
    defaultValue: t.string,
    required: t.bool,
};

DatePickerComponent.defaultProps = {
    defaultValue: null,
    required: false,
};

export default DatePickerComponent;
