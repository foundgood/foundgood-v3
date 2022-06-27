// React
import React, { useState } from 'react';

// Packages
import _get from 'lodash.get';

// Utilities
import { useElseware, useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import WithPermission from 'components/withPermission';
import TitlePreamble from 'components/_wizard/titlePreamble';
import ReportUpdatesInPage from 'components/_wizard/reportUpdatesInPage';
import Collection from 'components/_wizard/collection';

// Components shared for activities
import ActivityDissemination from 'components/_wizard/_cards/_cardContents/activityDissemination';
import ActivitySuccessMetrics from 'components/_wizard/_cards/_childCollections/activitySuccessMetrics';
import ActivityGoals from 'components/_wizard/_cards/_relatedItems/activityGoals';
import Activity from 'components/_wizard/_cards/_reportUpdates/activity';

const ActivitiesDisseminationComponent = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label, object, pickList, dataSet } = useLabels();
    const { ewUpdate, ewCreate, ewDelete } = useElseware();

    // ///////////////////
    // STATE
    // ///////////////////

    const [disseminationType, setDisseminationType] = useState(null);

    // ///////////////////
    // METHODS
    // ///////////////////

    function getItemData(formData) {
        const {
            Things_To_Do__c,
            Things_To_Do_Description__c,
            Location,
            Goals,
            Dissemination_Method__c,
            Publication_Type__c,
            Publication_Year__c,
            Publication_Title__c,
            Publication_Publisher__c,
            Publication_Author__c,
            Publication_DOI__c,
        } = formData;

        // Data for sf
        return {
            Activity_Type__c: CONSTANTS.ACTIVITIES.DISSEMINATION,
            Things_To_Do__c,
            Things_To_Do_Description__c,
            Initiative_Location__c: Location[0]?.selectValue,
            Additional_Location_Information__c: Location[0]?.textValue,
            activityGoals: Goals.map(item => item.selectValue),
            Dissemination_Method__c,
            Publication_Type__c,
            Publication_Year__c,
            Publication_Title__c,
            Publication_Publisher__c,
            Publication_Author__c,
            Publication_DOI__c,
        };
    }

    async function addItem(formData) {
        const { data: itemData } = await ewCreate(
            'initiative-activity/initiative-activity-and-children',
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
            'initiative-activity/initiative-activity-and-children',
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
        await ewDelete(
            'initiative-activity/initiative-activity-and-children',
            id
        );

        // Clean out item
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
            Dissemination_Method__c,
            Publication_Type__c,
            Publication_Year__c,
            Publication_Title__c,
            Publication_Publisher__c,
            Publication_Author__c,
            Publication_DOI__c,
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
        form.setValue('Dissemination_Method__c', Dissemination_Method__c);

        // Goals
        form.setValue(
            'Goals',
            utilities.activityGoals.getFromActivityId(Id).map(activityGoal => ({
                selectValue: activityGoal.Initiative_Goal__c,
            }))
        );

        // Journal type
        form.setValue('Publication_Type__c', Publication_Type__c);
        form.setValue('Publication_Year__c', Publication_Year__c);
        form.setValue('Publication_Title__c', Publication_Title__c);
        form.setValue('Publication_Publisher__c', Publication_Publisher__c);
        form.setValue('Publication_Author__c', Publication_Author__c);
        form.setValue('Publication_DOI__c', Publication_DOI__c);
    }

    function getYears() {
        const years = [];
        const currentYear = new Date().getFullYear();
        let startYear = currentYear - 10; // 10 years back
        while (startYear <= currentYear) {
            const year = startYear++;
            years.push({
                label: `${year}`,
                value: `${year}-01-01`,
            });
        }
        return years;
    }

    // ///////////////////
    // DATA
    // ///////////////////

    // Custom goals
    const customGoals = utilities.goals.getTypeCustom();

    // Get activities
    const activities = utilities.activities.getTypeDissemination();

    // ///////////////////
    // FIELDS
    // ///////////////////

    function itemFields() {
        return [
            {
                type: 'Text',
                name: 'Things_To_Do__c',
                label: object.label(
                    'Initiative_Activity__c.Things_To_Do__c__Dissemination'
                ),
                subLabel: object.helpText(
                    'Initiative_Activity__c.Things_To_Do__c__Dissemination'
                ),
                required: true,
                maxLength: 200,
            },
            {
                type: 'LongText',
                name: 'Things_To_Do_Description__c',
                label: object.label(
                    'Initiative_Activity__c.Things_To_Do_Description__c__Dissemination'
                ),
                subLabel: object.helpText(
                    'Initiative_Activity__c.Things_To_Do_Description__c__Dissemination'
                ),
                maxLength: 400,
            },
            {
                type: 'SelectList',
                name: 'Location',
                label: object.label(
                    'Initiative_Activity__c.Initiative_Location__c__Dissemination'
                ),
                subLabel: object.helpText(
                    'Initiative_Activity__c.Initiative_Location__c__Dissemination'
                ),
                showText: true,
                listMaxLength: 1,
                options: dataSet('Countries'),
                selectPlaceholder: label('FormCaptureSelectEmpty'),
                selectLabel: label('FormCaptureCountry'),
                textLabel: label('FormCaptureRegion'),
            },
            {
                type: 'Section',
                name: label('WizardModalSectionAdditionalDetails'),
            },
            {
                type: 'Select',
                name: 'Dissemination_Method__c',
                label: object.label(
                    'Initiative_Activity__c.Dissemination_Method__c'
                ),
                subLabel: object.helpText(
                    'Initiative_Activity__c.Dissemination_Method__c'
                ),
                required: true,
                options: pickList(
                    'Initiative_Activity__c.Dissemination_Method__c'
                ),
                onWatch(event) {
                    // Update type
                    setDisseminationType(event);
                },
            },
            ...(disseminationType === CONSTANTS.ACTIVITIES.ACTIVITY_JOURNAL
                ? [
                      {
                          type: 'Nested',
                          fields: [
                              {
                                  type: 'Text',
                                  name: 'Publication_Type__c',
                                  label: object.label(
                                      'Initiative_Activity__c.Publication_Type__c'
                                  ),
                                  subLabel: object.helpText(
                                      'Initiative_Activity__c.Publication_Type__c'
                                  ),
                                  maxLength: 30,
                              },

                              {
                                  type: 'Select',
                                  name: 'Publication_Year__c',
                                  label: object.label(
                                      'Initiative_Activity__c.Publication_Year__c'
                                  ),
                                  subLabel: object.helpText(
                                      'Initiative_Activity__c.Publication_Year__c'
                                  ),
                                  options: getYears(),
                              },
                              {
                                  type: 'Text',
                                  name: 'Publication_Title__c',
                                  label: object.label(
                                      'Initiative_Activity__c.Publication_Title__c'
                                  ),
                                  subLabel: object.helpText(
                                      'Initiative_Activity__c.Publication_Title__c'
                                  ),
                                  maxLength: 200,
                              },
                              {
                                  type: 'Text',
                                  name: 'Publication_Publisher__c',
                                  label: object.label(
                                      'Initiative_Activity__c.Publication_Publisher__c'
                                  ),
                                  subLabel: object.helpText(
                                      'Initiative_Activity__c.Publication_Publisher__c'
                                  ),
                                  maxLength: 200,
                              },
                              {
                                  type: 'Text',
                                  name: 'Publication_Author__c',
                                  label: object.label(
                                      'Initiative_Activity__c.Publication_Author__c'
                                  ),
                                  subLabel: object.helpText(
                                      'Initiative_Activity__c.Publication_Author__c'
                                  ),
                              },
                              {
                                  type: 'Text',
                                  name: 'Publication_DOI__c',
                                  label: object.label(
                                      'Initiative_Activity__c.Publication_DOI__c'
                                  ),
                                  subLabel: object.helpText(
                                      'Initiative_Activity__c.Publication_DOI__c'
                                  ),
                                  maxLength: 30,
                              },
                          ],
                      },
                  ]
                : []),
            {
                type: 'Section',
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
                        addLabel: label('ButtonAddActivityDissemination'),
                        emptyLabel: label(
                            'EmptyStateWizardPageActivitiesDissemination'
                        ),
                    },
                    methods: {
                        add: {
                            title: label(
                                'WizardModalHeadingActivitiesDissemination'
                            ),
                            action: addItem,
                        },
                        edit: {
                            title: label(
                                'WizardModalHeadingActivitiesDissemination'
                            ),
                            action: editItem,
                            setFieldValues: setItemFieldValues,
                        },
                        delete: {
                            title: label(
                                'WizardModalHeadingActivitiesDisseminationDelete'
                            ),
                            text: label(
                                'WizardModalTextActivitiesDisseminationDelete'
                            ),
                            action: deleteItem,
                        },
                    },
                    card: {
                        title(item) {
                            return item?.Things_To_Do__c;
                        },
                        type() {
                            return label('CardTypeActivityDissemination');
                        },
                        components(item) {
                            return {
                                cardContent: (
                                    <ActivityDissemination {...{ item }} />
                                ),
                                relatedItems: <ActivityGoals {...{ item }} />,
                                childCollection: (
                                    <ActivitySuccessMetrics {...{ item }} />
                                ),
                                reportUpdate: (
                                    <Activity
                                        {...{
                                            item,
                                            tagTypes: [
                                                CONSTANTS.TAGS.ACTIVITY,
                                                CONSTANTS.TAGS
                                                    .DISSEMINATION_ACTIVITY,
                                            ],
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

ActivitiesDisseminationComponent.propTypes = {};

ActivitiesDisseminationComponent.defaultProps = {};

ActivitiesDisseminationComponent.layout = 'wizard';

export default WithAuth(ActivitiesDisseminationComponent);
