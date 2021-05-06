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
import { useMetadata } from 'utilities/hooks';

const DateRangeComponent = ({
    controller,
    defaultValue,
    label,
    name,
    subLabel,
}) => {
    // Hook: Metadata
    const { labelTodo } = useMetadata();

    // Local state for handling dates
    const [from, setFrom] = useState(defaultValue.from);
    const [to, setTo] = useState(defaultValue.to);

    // Controller from useForm
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
            },
        },
    });

    // Update state when using setValue
    useEffect(() => {
        if (value) {
            setFrom(value.from);
            setTo(value.to);
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
                        <span className="mb-4 input-utility-text">
                            {labelTodo('From')}
                        </span>
                        <DayPickerInput
                            value={from}
                            formatDate={date =>
                                dayjs(date).format('YYYY-MM-DD')
                            }
                            placeholder="yyyy-mm-dd"
                            onDayChange={event => {
                                setFrom(event);
                                onChange({
                                    from: event
                                        ? dayjs(event).format('YYYY-MM-DD')
                                        : 'no-date',
                                    to: dayjs(to).format('YYYY-MM-DD'),
                                });
                            }}
                            classNames={{
                                container: cc([
                                    'input-defaults-date ',
                                    {
                                        'input-defaults-date-error':
                                            error?.type === 'isDateFrom',
                                    },
                                ]),
                                overlay: 'absolute bg-white mt-12',
                            }}
                        />
                    </div>
                    <div className="flex flex-col flex-grow">
                        <span className="mb-4 input-utility-text">
                            {labelTodo('To')}
                        </span>
                        <DayPickerInput
                            disabled={!from}
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
                                    from: dayjs(from).format('YYYY-MM-DD'),
                                    to: event
                                        ? dayjs(event).format('YYYY-MM-DD')
                                        : 'no-date',
                                });
                            }}
                            classNames={{
                                container: cc([
                                    'input-defaults-date transition-default',
                                    {
                                        'pointer-events-none opacity-50': !from,
                                        'input-defaults-date-error':
                                            error?.type === 'isDateTo',
                                    },
                                ]),
                                overlay: cc([
                                    'absolute bg-white mt-12',
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
    name: t.string,
    label: t.string,
    subLabel: t.string,
    defaultValue: t.shape({ from: t.string, to: t.string }),
    maxLength: t.number,
};

DateRangeComponent.defaultProps = {
    maxLength: 0,
    defaultValue: {
        from: null,
        to: null,
    },
};

export default DateRangeComponent;
