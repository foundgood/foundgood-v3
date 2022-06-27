// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { useController } from 'react-hook-form';

// Utilities
import { useLabels, useElseware } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import { SelectList } from 'components/_inputs';

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
    taggingCollections,
    theme,
    ...rest
}) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { ewGetAsync } = useElseware();
    const { label, getValueLabel } = useLabels();
    const {
        field: { onChange, value },
        fieldState: { error },
    } = useController({
        name,
        control: controller,
        defaultValue,
        rules: {
            validate: {
                isNumber: v =>
                    Object.values(v).every(x => /^(0|[1-9][0-9]*)$/.test(x)),
                required: v =>
                    required ? Object.values(v).every(x => !!x) : true,
            },
        },
    });

    // ///////////////////
    // STATE
    // ///////////////////

    // ///////////////////
    // METHODS
    // ///////////////////

    // ///////////////////
    // THEMING
    // ///////////////////

    const isBlue = theme === 'blue';
    const isTeal = theme === 'teal';

    // ///////////////////
    // RENDER
    // ///////////////////

    // TODO
    // Validation

    return (
        <div className="flex flex-col">
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
            <label className="flex flex-col mt-16 space-y-12">
                {metrics.length > 0 &&
                    metrics.map(metric => {
                        let tagType;

                        // Switch to do operations for each metric type
                        switch (metric?.Type__c) {
                            case CONSTANTS.ACTIVITY_SUCCESS_METRICS.FINANCIAL:
                                // Set tagType
                                tagType =
                                    CONSTANTS.TAGS.SUCCESS_METRIC_FINANCIAL;
                                break;
                            case CONSTANTS.ACTIVITY_SUCCESS_METRICS.PEOPLE:
                                // Set tagType
                                tagType = CONSTANTS.TAGS.SUCCESS_METRIC_PEOPLE;
                                break;
                            default:
                                // Set tagType
                                tagType = CONSTANTS.TAGS.SUCCESS_METRIC_CUSTOM;
                                break;
                        }

                        let postTitle;

                        // Switch to do operations for each metric type
                        switch (metric?.Type__c) {
                            case CONSTANTS.ACTIVITY_SUCCESS_METRICS.FINANCIAL:
                                // Set postTitle
                                postTitle = metric?.CurrencyIsoCode;
                                break;
                            case CONSTANTS.ACTIVITY_SUCCESS_METRICS.PEOPLE:
                                // Set postTitle
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
                                // Set postTitle
                                postTitle = null;
                                break;
                        }

                        return (
                            <div
                                key={metric.Id}
                                className={cc([
                                    'flex flex-col p-16 rounded-8',
                                    {
                                        'bg-blue-20': isBlue,
                                        'bg-teal-20': isTeal,
                                    },
                                ])}>
                                {/* Metric value */}
                                <div className="grid items-center grid-cols-8 gap-16">
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

                                {taggingCollections?.length > 0 && (
                                    <div
                                        className={cc([
                                            'flex flex-col space-y-20 border-t mt-16 pt-16',
                                            {
                                                'border-blue-10': isBlue,
                                                'border-teal-10': isTeal,
                                            },
                                        ])}>
                                        {taggingCollections.map(
                                            taggingCollection => (
                                                <>
                                                    <SelectList
                                                        key={
                                                            taggingCollection.Id
                                                        }
                                                        {...{
                                                            name: `metricTaggingSelect-${taggingCollection.Tag__c}-${metric.Id}`,
                                                            label: label(
                                                                `ReportUpdateModalMetricTagLabel`
                                                            ),
                                                            subLabel:
                                                                taggingCollection.Account_Name__c,
                                                            defaultValue: utilities.tags
                                                                .getFromRelationKeyId(
                                                                    'Initiative_Activity_Success_Metric__c',
                                                                    metric.Id
                                                                )
                                                                .filter(
                                                                    tag =>
                                                                        tag
                                                                            .Tag__r
                                                                            ?.Collection__c ===
                                                                        taggingCollection.Tag__c
                                                                )
                                                                .map(tag => ({
                                                                    selectValue:
                                                                        tag
                                                                            .Tag__r
                                                                            ?.Id,
                                                                })),
                                                            listMaxLength: 3,
                                                            controller,
                                                            theme,
                                                            nested: true,
                                                            async options() {
                                                                // Get all type specific tag options
                                                                const tagOptions = await ewGetAsync(
                                                                    'tag/tag-collection',
                                                                    {
                                                                        id:
                                                                            taggingCollection
                                                                                .Tag__r
                                                                                ?.Id,
                                                                        type: tagType,
                                                                    }
                                                                );

                                                                // Get all general tag options for metrics
                                                                const tagOptionsGeneral = await ewGetAsync(
                                                                    'tag/tag-collection',
                                                                    {
                                                                        id:
                                                                            taggingCollection
                                                                                .Tag__r
                                                                                ?.Id,
                                                                        type:
                                                                            CONSTANTS
                                                                                .TAGS
                                                                                .SUCCESS_METRIC,
                                                                    }
                                                                );

                                                                // Merge (to array)
                                                                const allTags = [
                                                                    ...Object.values(
                                                                        tagOptions?.data
                                                                    ),
                                                                    ...Object.values(
                                                                        tagOptionsGeneral?.data
                                                                    ),
                                                                ];

                                                                // Get default tags (no category)
                                                                const tagOptionsWithoutCategory = allTags.filter(
                                                                    tag =>
                                                                        !tag.Category__c
                                                                );

                                                                // Get tags based on initiative category
                                                                const tagOptionsWithInitiativeCategory = allTags.filter(
                                                                    tag =>
                                                                        tag.Category__c ===
                                                                        utilities.initiative.get()
                                                                            ?.Category__c
                                                                );

                                                                // Return both sets of tags
                                                                return [
                                                                    ...tagOptionsWithoutCategory,
                                                                    ...tagOptionsWithInitiativeCategory,
                                                                ].map(tag => ({
                                                                    label:
                                                                        tag.Name,
                                                                    value:
                                                                        tag.Id,
                                                                }));
                                                            },
                                                        }}
                                                    />
                                                </>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </label>
        </div>
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
    taggingCollections: t.array,
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
    taggingCollections: [],
    theme: 'teal',
};

export default Metrics;
