// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { useController } from 'react-hook-form';

// Utilities
import { useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

const Metrics = ({
    controller,
    defaultValue,
    disabled,
    label: inputLabel,
    metrics,
    name,
    placeholder,
    required,
    setValue,
    subLabel,
    theme,
    ...rest
}) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label, getValueLabel } = useLabels();
    const {
        field: { onChange, value },
        fieldState: { error },
    } = useController({
        name,
        control: controller,
        defaultValue: defaultValue,
        rules: {
            validate: {
                validate: {
                    isNumber: v =>
                        Object.values(v).every(x =>
                            /^(0|[1-9][0-9]*)$/.test(x)
                        ),
                    required: v =>
                        required ? Object.values(v).every(x => !!x) : true,
                },
            },
        },
    });

    // ///////////////////
    // THEMING
    // ///////////////////

    const isBlue = theme === 'blue';
    const isTeal = theme === 'teal';

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <label className="flex flex-col">
            {inputLabel && (
                <span
                    className={cc([
                        'input-label',
                        {
                            'input-label-blue': isBlue,
                            'input-label-teal': isTeal,
                        },
                    ])}>
                    {inputLabel}
                </span>
            )}
            {subLabel && (
                <span
                    className={cc([
                        'mt-8 input-sublabel',
                        {
                            'input-sublabel-blue': isBlue,
                            'input-sublabel-teal': isTeal,
                        },
                    ])}>
                    {subLabel}
                </span>
            )}

            {/* Metrics */}
            <div className="flex flex-col mt-16 space-y-12">
                {metrics.length > 0 &&
                    metrics.map(metric => {
                        let postTitle;

                        switch (metric?.Type__c) {
                            case CONSTANTS.ACTIVITY_SUCCESS_METRICS.FINANCIAL:
                                postTitle = metric?.CurrencyIsoCode;
                                break;
                            case CONSTANTS.ACTIVITY_SUCCESS_METRICS.PEOPLE:
                                const gender = `${getValueLabel(
                                    'Initiative_Activity_Success_Metric__c.Gender__c',
                                    metric?.Gender__c
                                )}${
                                    metric?.Gender_Other__c
                                        ? ` (${metric?.Gender_Other__c})`
                                        : ''
                                }`;
                                postTitle = `${gender} ${label(
                                    'SentenceBetweenAge'
                                )} ${metric?.Lowest_Age__c} ${label(
                                    'SentenceAnd'
                                )} ${metric?.Highest_Age__c}`;
                                break;
                            default:
                                postTitle = null;
                                break;
                        }

                        return (
                            <div
                                key={metric.Id}
                                className={cc([
                                    'grid items-center grid-cols-8 p-16 rounded-8 gap-16',
                                    {
                                        'bg-blue-20': isBlue,
                                        'bg-teal-20': isTeal,
                                    },
                                ])}>
                                <div className="flex flex-col justify-center col-span-4">
                                    {/* Pre title */}
                                    <span
                                        className={cc([
                                            't-sh6',
                                            {
                                                'text-blue-60': isBlue,
                                                'text-teal-60': isTeal,
                                            },
                                        ])}>
                                        {getValueLabel(
                                            'Initiative_Activity_Success_Metric__c.Type__c',
                                            metric?.Type__c
                                        )}
                                    </span>
                                    {/* Title */}
                                    <h5
                                        className={cc([
                                            'truncate t-h6',
                                            {
                                                'text-blue-100': isBlue,
                                                'text-teal-100': isTeal,
                                            },
                                        ])}>
                                        {metric?.Name}
                                    </h5>
                                    {/* Post title */}
                                    {postTitle && (
                                        <span
                                            className={cc([
                                                't-footnote',
                                                {
                                                    'text-blue-60': isBlue,
                                                    'text-teal-60': isTeal,
                                                },
                                            ])}>
                                            {postTitle}
                                        </span>
                                    )}
                                </div>

                                {/* Item controls */}
                                <div className="flex justify-end col-span-4">
                                    <input
                                        type="tel"
                                        defaultValue={
                                            defaultValue
                                                ? defaultValue[metric.Id]
                                                : false
                                        }
                                        value={value?.[metric.Id] ?? ''}
                                        placeholder={0}
                                        onChange={event => {
                                            onChange({
                                                ...value,
                                                [metric.Id]: parseInt(
                                                    event.target.value,
                                                    10
                                                ),
                                            });
                                        }}
                                        className={cc([
                                            'text-right',
                                            'input-defaults appearance-none',
                                            {
                                                'input-defaults-blue': isBlue,
                                                'input-defaults-teal': isTeal,
                                                'input-defaults-error': error,
                                            },
                                        ])}
                                        {...rest}
                                    />
                                </div>
                            </div>
                        );
                    })}
            </div>
        </label>
    );
};

Metrics.propTypes = {
    controller: t.object,
    defaultValue: t.object,
    disabled: t.bool,
    label: t.string,
    metrics: t.array.isRequired,
    name: t.string.isRequired,
    placeholder: t.string,
    required: t.bool,
    subLabel: t.string,
    theme: t.oneOf(['teal', 'blue']),
};

Metrics.defaultProps = {
    controller: null,
    defaultValue: null,
    disabled: false,
    label: '',
    metrics: [],
    name: '',
    placeholder: '',
    required: false,
    subLabel: '',
    theme: 'teal',
};

export default Metrics;
