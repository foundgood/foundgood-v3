// React
import React from 'react';

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
import ActivityEngagement from 'components/_wizard/_cards/_cardContents/activityEngagement';
import ActivitySuccessMetrics from 'components/_wizard/_cards/_childCollections/activitySuccessMetrics';
import ActivityGoals from 'components/_wizard/_cards/_relatedItems/activityGoals';
import Activity from 'components/_wizard/_cards/_reportUpdates/activity';

const ActivitiesEngagementComponent = () => {
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
    // METHODS
    // ///////////////////

    function getItemData(formData) {
        const {
            Things_To_Do__c,
            Things_To_Do_Description__c,
            Location,
            Goals,
            Engagement_Method__c,
        } = formData;

        // Data for sf
        return {
            Activity_Type__c: CONSTANTS.ACTIVITIES.ENGAGEMENT,
            Things_To_Do__c,
            Things_To_Do_Description__c,
            Initiative_Location__c: Location[0]?.selectValue,
            Additional_Location_Information__c: Location[0]?.textValue,
            Engagement_Method__c,
            activityGoals: Goals.map(item => item.selectValue),
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
            Engagement_Method__c,
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
        form.setValue('Engagement_Method__c', Engagement_Method__c);

        // Goals
        form.setValue(
            'Goals',
            utilities.activityGoals.getFromActivityId(Id).map(activityGoal => ({
                selectValue: activityGoal.Initiative_Goal__c,
            }))
        );
    }

    // ///////////////////
    // DATA
    // ///////////////////

    // Custom goals
    const customGoals = utilities.goals.getTypeCustom();

    // Get activities
    const activities = utilities.activities.getTypeEngagement();

    // ///////////////////
    // FIELDS
    // ///////////////////

    function itemFields() {
        return [
            {
                type: 'Text',
                name: 'Things_To_Do__c',
                label: object.label(
                    'Initiative_Activity__c.Things_To_Do__c__Engagement'
                ),
                subLabel: object.helpText(
                    'Initiative_Activity__c.Things_To_Do__c__Engagement'
                ),
                required: true,
                maxLength: 200,
            },
            {
                type: 'LongText',
                name: 'Things_To_Do_Description__c',
                label: object.label(
                    'Initiative_Activity__c.Things_To_Do_Description__c__Engagement'
                ),
                subLabel: object.helpText(
                    'Initiative_Activity__c.Things_To_Do_Description__c__Engagement'
                ),
                maxLength: 400,
            },
            {
                type: 'SelectList',
                name: 'Location',
                label: object.label(
                    'Initiative_Activity__c.Initiative_Location__c__Engagement'
                ),
                subLabel: object.helpText(
                    'Initiative_Activity__c.Initiative_Location__c__Engagement'
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
                name: 'Engagement_Method__c',
                label: object.label(
                    'Initiative_Activity__c.Engagement_Method__c'
                ),
                subLabel: object.helpText(
                    'Initiative_Activity__c.Engagement_Method__c'
                ),
                required: true,
                options: pickList(
                    'Initiative_Activity__c.Engagement_Method__c'
                ),
            },
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
                        addLabel: label('ButtonAddActivityEngagement'),
                        emptyLabel: label(
                            'EmptyStateWizardPageActivitiesEngagement'
                        ),
                    },
                    methods: {
                        add: {
                            title: label(
                                'WizardModalHeadingActivitiesEngagement'
                            ),
                            action: addItem,
                        },
                        edit: {
                            title: label(
                                'WizardModalHeadingActivitiesEngagement'
                            ),
                            action: editItem,
                            setFieldValues: setItemFieldValues,
                        },
                        delete: {
                            title: label(
                                'WizardModalHeadingActivitiesEngagementDelete'
                            ),
                            text: label(
                                'WizardModalTextActivitiesEngagementDelete'
                            ),
                            action: deleteItem,
                        },
                    },
                    card: {
                        title(item) {
                            return item?.Things_To_Do__c;
                        },
                        type() {
                            return label('CardTypeActivityEngagement');
                        },
                        components(item) {
                            return {
                                cardContent: (
                                    <ActivityEngagement {...{ item }} />
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
                                                    .ENGAGEMENT_ACTIVITY,
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

ActivitiesEngagementComponent.propTypes = {};

ActivitiesEngagementComponent.defaultProps = {};

ActivitiesEngagementComponent.layout = 'wizard';

export default WithAuth(ActivitiesEngagementComponent);
