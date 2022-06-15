// React
import React, { useState } from 'react';

// Packages
import _get from 'lodash.get';

// Utilities
import { useElseware, useLabels, useWizardSubmit } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import WithPermission from 'components/withPermission';
import TitlePreamble from 'components/_wizard/titlePreamble';
import ReportUpdatesInPage from 'components/_wizard/reportUpdatesInPage';
import {
    ReportUpdate,
    ActivityCardContent,
    ChildCollection,
    RelatedItems,
} from 'components/_wizard/_cards';
import Collection from 'components/_wizard/collection';

const ActivitiesComponent = ({ pageProps }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label, object, pickList, dataSet, getValueLabel } = useLabels();
    const { ewUpdate, ewCreate, ewDelete } = useElseware();
    useWizardSubmit();

    // ///////////////////
    // STATE
    // ///////////////////

    const [childItemType, setChildItemType] = useState();

    // ///////////////////
    // METHODS
    // ///////////////////

    function getItemData(formData) {
        const {
            Things_To_Do__c,
            Things_To_Do_Description__c,
            Location,
            Goals,
        } = formData;

        // Data for sf
        return {
            Activity_Type__c: CONSTANTS.ACTIVITIES.INTERVENTION,
            Things_To_Do__c,
            Things_To_Do_Description__c,
            Initiative_Location__c: Location[0]?.selectValue,
            Additional_Location_Information__c: Location[0]?.textValue,
            KPI_Category__c: utilities.initiative.get().Category__c,
            activityGoals: Goals.map(item => item.selectValue),
        };
    }

    async function addItem(formData) {
        const { data: itemData } = await ewCreate(
            'initiative-activity/initiative-activity-and-goals',
            {
                ...getItemData(formData),
                Initiative__c: utilities.initiative.get().Id,
            }
        );

        // Destructure response
        const { _activityGoals, ...rest } = itemData;

        // Update main data
        utilities.updateInitiativeData('_activities', rest);

        // Updated related data
        utilities.updateInitiativeDataRelations(
            '_activityGoals',
            _activityGoals
        );
    }

    async function editItem(formData, id) {
        const { data: itemData } = await ewUpdate(
            'initiative-activity/initiative-activity-and-goals',
            id,
            getItemData(formData)
        );

        // Destructure response
        const { _activityGoals, ...rest } = itemData;

        // Clean out existing related data
        utilities.removeInitiativeDataRelations(
            '_activityGoals',
            item => item.Initiative_Activity__c === id
        );

        // Update main data
        utilities.updateInitiativeData('_activities', rest);

        // Updated related data
        utilities.updateInitiativeDataRelations(
            '_activityGoals',
            _activityGoals
        );
    }

    async function deleteItem(id) {
        // Delete
        await ewDelete('initiative-activity/initiative-activity-and-goals', id);

        // Clean out activity
        utilities.removeInitiativeData('_activities', id);

        // Clean out existing related data
        utilities.removeInitiativeDataRelations(
            '_activityGoals',
            item => item.Initiative_Activity__c === id
        );
    }

    function setItemFieldValues(form, id) {
        const {
            Id,
            Things_To_Do__c,
            Things_To_Do_Description__c,
            Initiative_Location__c,
            Additional_Location_Information__c,
        } = utilities.activities.get(id);

        form.setValue(
            'Things_To_Do_Description__c',
            Things_To_Do_Description__c
        );
        form.setValue('Things_To_Do__c', Things_To_Do__c);
        form.setValue('Location', [
            {
                selectValue: Initiative_Location__c,
                textValue: Additional_Location_Information__c,
            },
        ]);

        form.setValue(
            'Goals',
            utilities.activityGoals.getFromActivityId(Id).map(activityGoal => ({
                selectValue: activityGoal.Initiative_Goal__c,
            }))
        );
    }

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
    // DATA
    // ///////////////////

    // Custom goals
    const customGoals = utilities.goals.getTypeCustom();

    // Get activities
    const activities = utilities.activities.getTypeIntervention();

    // ///////////////////
    // FIELDS
    // ///////////////////

    function itemFields(context) {
        return [
            {
                type: 'Text',
                name: 'Things_To_Do__c',
                label: object.label('Initiative_Activity__c.Things_To_Do__c'),
                required: true,
                // Type options
                subLabel: object.helpText(
                    'Initiative_Activity__c.Things_To_Do__c'
                ),
                maxLength: 200,
            },
            {
                type: 'LongText',
                name: 'Things_To_Do_Description__c',
                label: object.label(
                    'Initiative_Activity__c.Things_To_Do_Description__c'
                ),
                // Type options
                subLabel: object.helpText(
                    'Initiative_Activity__c.Things_To_Do_Description__c'
                ),
                maxLength: 400,
            },
            {
                type: 'SelectList',
                name: 'Location',
                label: object.label(
                    'Initiative_Activity__c.Initiative_Location__c'
                ),
                // Type options
                showText: true,
                listMaxLength: 1,
                options: dataSet('Countries'),
                selectPlaceholder: label('FormCaptureSelectEmpty'),
                subLabel: object.helpText(
                    'Initiative_Activity__c.Initiative_Location__c'
                ),
                selectLabel: label('FormCaptureCountry'),
                textLabel: label('FormCaptureRegion'),
            },
            {
                type: 'SelectList',
                name: 'Goals',
                label: object.label('Initiative_Goal__c.Goal__c'),
                // Type options
                options: customGoals.map(goal => ({
                    value: goal.Id,
                    label: goal.Goal__c,
                })),
                subLabel: object.helpText('Initiative_Goal__c.Goal__c'),
                missingOptionsLabel: label('EmptyStateInputGoals'),
            },
        ];
    }

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
        <WithPermission context>
            <TitlePreamble />
            <ReportUpdatesInPage
                {...{
                    items: activities,
                    itemRelationKey: 'Initiative_Activity__c',
                }}
            />
            <Collection
                {...{
                    collection: {
                        items: activities,
                        fields: itemFields,
                        addLabel: label('ButtonAddActivity'),
                        emptyLabel: label('EmptyStateWizardPageActivities'),
                    },
                    methods: {
                        add: {
                            title: label('WizardModalHeadingActivities'),
                            action: addItem,
                        },
                        edit: {
                            title: label('WizardModalHeadingActivities'),
                            action: editItem,
                            setFieldValues: setItemFieldValues,
                        },
                        delete: {
                            title: label('WizardModalHeadingActivitiesDelete'),
                            text: label('WizardModalTextActivitiesDelete'),
                            action: deleteItem,
                        },
                    },
                    card: {
                        title(item) {
                            return item?.Things_To_Do__c;
                        },
                        type() {
                            return label('CardTypeActivity');
                        },
                        components(item) {
                            return {
                                cardContent: (
                                    <ActivityCardContent {...{ item }} />
                                ),
                                relatedItems: (
                                    <RelatedItems
                                        {...{
                                            title: label(
                                                'CardRelatedItemsHeadingGoals'
                                            ),
                                            collection: {
                                                title(item) {
                                                    return item
                                                        .Initiative_Goal__r
                                                        .Goal__c;
                                                },
                                                type() {
                                                    return label(
                                                        'CardTypeGoal'
                                                    );
                                                },
                                                items: utilities.activityGoals.getFromActivityId(
                                                    item.Id
                                                ),
                                            },
                                        }}
                                    />
                                ),
                                childCollection: (
                                    <ChildCollection
                                        {...{
                                            title: label(
                                                'ChildCollectionHeadingMetrics'
                                            ),
                                            item,
                                            methods: {
                                                add: {
                                                    title: label(
                                                        'WizardModalHeadingMetrics'
                                                    ),
                                                    action: addChildItem,
                                                },
                                                edit: {
                                                    title: label(
                                                        'WizardModalHeadingMetrics'
                                                    ),
                                                    action: editChildItem,
                                                    setFieldValues: setChildItemFieldValues,
                                                },
                                                delete: {
                                                    title: label(
                                                        'WizardModalHeadingMetrics'
                                                    ),
                                                    text: label(
                                                        'WizardModalTextMetricsDelete'
                                                    ),
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
                                                    switch (
                                                        childItem?.Type__c
                                                    ) {
                                                        case CONSTANTS
                                                            .ACTIVITY_SUCCESS_METRICS
                                                            .FINANCIAL:
                                                            return childItem?.CurrencyIsoCode;
                                                        case CONSTANTS
                                                            .ACTIVITY_SUCCESS_METRICS
                                                            .PEOPLE:
                                                            const gender = `${getValueLabel(
                                                                'Initiative_Activity_Success_Metric__c.Gender__c',
                                                                childItem?.Gender__c
                                                            )}${
                                                                childItem?.Gender_Other__c &&
                                                                ` (${childItem?.Gender_Other__c})`
                                                            }`;
                                                            return `${gender} ${label(
                                                                'SentenceBetweenAge'
                                                            )} ${
                                                                childItem?.Lowest_Age__c
                                                            } ${label(
                                                                'SentenceAnd'
                                                            )} ${
                                                                childItem?.Highest_Age__c
                                                            }`;
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
                                ),
                                reportUpdate: (
                                    <ReportUpdate
                                        {...{
                                            title: label(
                                                'ReportUpdateModalActivityHeading'
                                            ),
                                            tagging: {
                                                item,
                                                relationKey:
                                                    'Initiative_Activity__c',
                                                type: CONSTANTS.TAGS.ACTIVITY,
                                            },
                                            reflection: {
                                                item,
                                                relationKey:
                                                    'Initiative_Activity__c',
                                                type:
                                                    CONSTANTS.REPORT_DETAILS
                                                        .ACTIVITY_OVERVIEW,
                                            },
                                            metrics: {},
                                            status: {},
                                        }}
                                    />
                                ),
                            };
                        },
                    },
                }}
            />
        </WithPermission>
    );
};

ActivitiesComponent.propTypes = {};

ActivitiesComponent.defaultProps = {};

ActivitiesComponent.layout = 'wizard';

export default WithAuth(ActivitiesComponent);
