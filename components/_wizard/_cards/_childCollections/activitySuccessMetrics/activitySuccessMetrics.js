// React
import React, { useState } from 'react';

// Packages

// Utilities
import { useElseware, useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import { ChildCollection } from 'components/_wizard/_cards';

const ActivitySuccessMetricsComponent = ({ item }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label, object, pickList, dataSet, getValueLabel } = useLabels();
    const { ewUpdate, ewCreate, ewDelete } = useElseware();

    // ///////////////////
    // STATE
    // ///////////////////

    const [childItemType, setChildItemType] = useState();

    // ///////////////////
    // METHODS
    // ///////////////////

    function getChildItemData(formData) {
        const { Name, Gender, Age, CurrencyIsoCode } = formData;

        switch (childItemType) {
            case CONSTANTS.ACTIVITY_SUCCESS_METRICS.CUSTOM:
                return {
                    Name,
                };
            case CONSTANTS.ACTIVITY_SUCCESS_METRICS.FINANCIAL:
                return {
                    Name,
                    CurrencyIsoCode,
                };
            case CONSTANTS.ACTIVITY_SUCCESS_METRICS.PEOPLE:
                return {
                    Name,
                    Gender__c: Gender[0].selectValue,
                    Gender_Other__c: Gender[0].textValue,
                    Lowest_Age__c: Age.from,
                    Highest_Age__c: Age.to,
                };
        }
    }

    async function addChildItem(formData, item) {
        const { data: childData } = await ewCreate(
            'initiative-activity-success-metric/initiative-activity-success-metric',
            {
                ...getChildItemData(formData),
                Type__c: formData.Type__c,
                Initiative_Activity__c: item.Id,
            }
        );

        utilities.updateInitiativeData('_activitySuccessMetrics', childData);
    }

    async function editChildItem(formData, id) {
        const { data: childData } = await ewUpdate(
            'initiative-activity-success-metric/initiative-activity-success-metric',
            id,
            getChildItemData(formData)
        );

        utilities.updateInitiativeData('_activitySuccessMetrics', childData);
    }

    async function deleteChildItem(id) {
        await ewDelete(
            'initiative-activity-success-metric/initiative-activity-success-metric',
            id
        );
        utilities.removeInitiativeData('_activitySuccessMetrics', id);
    }

    function setChildItemFieldValues(form, id) {
        const {
            Type__c,
            Name,
            Gender__c,
            Gender_Other__c,
            Lowest_Age__c,
            Highest_Age__c,
            CurrencyIsoCode,
        } = utilities.activitySuccessMetrics.get(id);

        // Set Type for form display
        setChildItemType(Type__c);

        // Add common content
        form.setValue('Name', Name);

        // Add content to form accordingly to Type__c
        switch (Type__c) {
            case CONSTANTS.ACTIVITY_SUCCESS_METRICS.FINANCIAL:
                form.setValue('CurrencyIsoCode', CurrencyIsoCode);
                break;
            case CONSTANTS.ACTIVITY_SUCCESS_METRICS.PEOPLE:
                form.setValue('Gender', [
                    {
                        selectValue: Gender__c,
                        textValue: Gender_Other__c,
                    },
                ]);
                form.setValue('Age', {
                    from: Lowest_Age__c,
                    to: Highest_Age__c,
                });
                break;
        }
    }

    // ///////////////////
    // FIELDS
    // ///////////////////

    function childItemFields(item, context) {
        return [
            ...(context === 'add'
                ? [
                      {
                          type: 'Select',
                          name: 'Type__c',
                          label: object.label(
                              'Initiative_Activity_Success_Metric__c.Type__c'
                          ),
                          subLabel: object.helpText(
                              'Initiative_Activity_Success_Metric__c.Type__c'
                          ),
                          defaultValue:
                              CONSTANTS.ACTIVITY_SUCCESS_METRICS.CUSTOM,
                          required: true,
                          options: pickList(
                              'Initiative_Activity_Success_Metric__c.Type__c'
                          ),
                          onWatch(event, form) {
                              // Update type
                              setChildItemType(event);

                              // Remove validation from form elements based on type (event)
                              switch (event) {
                                  case CONSTANTS.ACTIVITY_SUCCESS_METRICS
                                      .CUSTOM:
                                      form.unregister('Gender');
                                      form.unregister('Age');
                                      form.unregister('Currency');
                                      break;
                                  case CONSTANTS.ACTIVITY_SUCCESS_METRICS
                                      .FINANCIAL:
                                      form.unregister('Gender');
                                      form.unregister('Age');
                                      break;
                                  case CONSTANTS.ACTIVITY_SUCCESS_METRICS
                                      .PEOPLE:
                                      form.unregister('Gender');
                                      form.unregister('Age');
                                      break;
                              }
                          },
                      },
                  ]
                : []),
            {
                type: 'Text',
                name: 'Name',
                label: object.label(
                    'Initiative_Activity_Success_Metric__c.Name'
                ),
                required: true,
                maxLength: 200,
            },
            ...(childItemType === CONSTANTS.ACTIVITY_SUCCESS_METRICS.PEOPLE
                ? [
                      {
                          type: 'SelectList',
                          name: 'Gender',
                          label: object.label(
                              'Initiative_Activity_Success_Metric__c.Gender__c'
                          ),
                          subLabel: object.helpText(
                              'Initiative_Activity_Success_Metric__c.Gender__c'
                          ),
                          required:
                              childItemType ===
                              CONSTANTS.ACTIVITY_SUCCESS_METRICS.PEOPLE,
                          textPlaceholder: object.label(
                              'Initiative_Activity_Success_Metric__c.Gender_Other__c'
                          ),
                          options: pickList(
                              'Initiative_Activity_Success_Metric__c.Gender__c'
                          ),
                          showText: true,
                          listMaxLength: 1,
                      },
                      {
                          type: 'Range',
                          name: 'Age',
                          label: object.label(
                              'Initiative_Activity_Success_Metric__c.Age'
                          ),
                          subLabel: object.helpText(
                              'Initiative_Activity_Success_Metric__c.Age'
                          ),
                          required:
                              childItemType ===
                              CONSTANTS.ACTIVITY_SUCCESS_METRICS.PEOPLE,
                          maxValue: 200,
                          minValue: 0,
                      },
                  ]
                : []),
            ...(childItemType === CONSTANTS.ACTIVITY_SUCCESS_METRICS.FINANCIAL
                ? [
                      {
                          type: 'Select',
                          name: 'CurrencyIsoCode',
                          label: object.label(
                              'Initiative_Activity_Success_Metric__c.CurrencyIsoCode'
                          ),
                          subLabel: object.helpText(
                              'Initiative_Activity_Success_Metric__c.CurrencyIsoCode'
                          ),
                          required:
                              childItemType ===
                              CONSTANTS.ACTIVITY_SUCCESS_METRICS.FINANCIAL,
                          // Type options
                          options: dataSet('Currencies'),
                      },
                  ]
                : []),
        ];
    }

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <ChildCollection
            {...{
                title: label('ChildCollectionHeadingMetrics'),
                item,
                methods: {
                    add: {
                        title: label('WizardModalHeadingMetrics'),
                        action: addChildItem,
                    },
                    edit: {
                        title: label('WizardModalHeadingMetrics'),
                        action: editChildItem,
                        setFieldValues: setChildItemFieldValues,
                    },
                    delete: {
                        title: label('WizardModalHeadingMetrics'),
                        text: label('WizardModalTextMetricsDelete'),
                        action: deleteChildItem,
                    },
                },
                collection: {
                    title(childItem) {
                        return childItem?.Name;
                    },
                    preTitle(childItem) {
                        return getValueLabel(
                            'Initiative_Activity_Success_Metric__c.Type__c',
                            childItem?.Type__c
                        );
                    },
                    postTitle(childItem) {
                        switch (childItem?.Type__c) {
                            case CONSTANTS.ACTIVITY_SUCCESS_METRICS.FINANCIAL:
                                return childItem?.CurrencyIsoCode;
                            case CONSTANTS.ACTIVITY_SUCCESS_METRICS.PEOPLE:
                                const gender = `${getValueLabel(
                                    'Initiative_Activity_Success_Metric__c.Gender__c',
                                    childItem?.Gender__c
                                )}${
                                    childItem?.Gender_Other__c
                                        ? ` (${childItem?.Gender_Other__c})`
                                        : ''
                                }`;
                                return `${gender} ${label(
                                    'SentenceBetweenAge'
                                )} ${childItem?.Lowest_Age__c} ${label(
                                    'SentenceAnd'
                                )} ${childItem?.Highest_Age__c}`;
                            default:
                                return null;
                        }
                    },
                    fields: childItemFields,
                    items(item) {
                        return utilities.activitySuccessMetrics.getFromActivityId(
                            item.Id
                        );
                    },
                },
            }}
        />
    );
};

ActivitySuccessMetricsComponent.propTypes = {};

ActivitySuccessMetricsComponent.defaultProps = {};

export default ActivitySuccessMetricsComponent;
