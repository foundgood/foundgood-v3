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
import ActivityPhysical from 'components/_wizard/_cards/_cardContents/activityPhysical';
import ActivitySuccessMetrics from 'components/_wizard/_cards/_childCollections/activitySuccessMetrics';
import ActivityGoals from 'components/_wizard/_cards/_relatedItems/activityGoals';
import Activity from 'components/_wizard/_cards/_reportUpdates/activity';

const ActivitiesPhysicalComponent = () => {
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
            Implementation_Stage__c,
            Value,
            Regulations,
            Goals,
        } = formData;

        // Data for sf
        return {
            Activity_Type__c: CONSTANTS.ACTIVITIES.PHYSICAL,
            Things_To_Do__c,
            Things_To_Do_Description__c,
            Initiative_Location__c: Location[0]?.selectValue,
            Additional_Location_Information__c: Location[0]?.textValue,
            Implementation_Stage__c,
            Financial_Value__c: Value[0]?.textValue,
            CurrencyIsoCode: Value[0]?.selectValue,
            activityGoals: Goals.map(item => item.selectValue),
            activityRegulations: Regulations.map(item => item.selectValue),
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
        const { _activityGoals, _activityRegulations, ...rest } = itemData;

        // Update main data
        utilities.updateInitiativeData('_activities', rest);

        // Updated related data
        utilities.updateInitiativeDataRelations(
            '_activityGoals',
            _activityGoals
        );
        utilities.updateInitiativeDataRelations(
            '_activityRegulations',
            _activityRegulations
        );
    }

    async function editItem(formData, id) {
        const { data: itemData } = await ewUpdate(
            'initiative-activity/initiative-activity-and-children',
            id,
            getItemData(formData)
        );

        // Destructure response
        const { _activityGoals, _activityRegulations, ...rest } = itemData;

        // Clean out existing related data
        utilities.removeInitiativeDataRelations(
            '_activityGoals',
            item => item.Initiative_Activity__c === id
        );
        utilities.removeInitiativeDataRelations(
            '_activityRegulations',
            item => item.Initiative_Activity__c === id
        );

        // Update main data
        utilities.updateInitiativeData('_activities', rest);

        // Updated related data
        utilities.updateInitiativeDataRelations(
            '_activityGoals',
            _activityGoals
        );
        utilities.updateInitiativeDataRelations(
            '_activityRegulations',
            _activityRegulations
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
        utilities.removeInitiativeDataRelations(
            '_activityRegulations',
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
            Implementation_Stage__c,
            Financial_Value__c,
            CurrencyIsoCode,
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
        form.setValue('Implementation_Stage__c', Implementation_Stage__c);
        form.setValue('Value', [
            {
                selectValue: CurrencyIsoCode,
                textValue: Financial_Value__c,
            },
        ]);

        // Regulations
        form.setValue(
            'Regulations',
            utilities.activityRegulations
                .getFromActivityId(Id)
                .map(activityRegulation => ({
                    selectValue: activityRegulation.Id,
                }))
        );

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

    // Regulations
    const regulations = utilities.activityRegulations.getAll();

    // Get activities
    const activities = utilities.activities.getTypePhysical();

    // ///////////////////
    // FIELDS
    // ///////////////////

    function itemFields() {
        return [
            {
                type: 'Text',
                name: 'Things_To_Do__c',
                label: object.label(
                    'Initiative_Activity__c.Things_To_Do__c__Physical'
                ),
                subLabel: object.helpText(
                    'Initiative_Activity__c.Things_To_Do__c__Physical'
                ),
                required: true,
                maxLength: 200,
            },
            {
                type: 'LongText',
                name: 'Things_To_Do_Description__c',
                label: object.label(
                    'Initiative_Activity__c.Things_To_Do_Description__c__Physical'
                ),
                subLabel: object.helpText(
                    'Initiative_Activity__c.Things_To_Do_Description__c__Physical'
                ),
                maxLength: 400,
            },
            {
                type: 'SelectList',
                name: 'Location',
                label: object.label(
                    'Initiative_Activity__c.Initiative_Location__c__Physical'
                ),
                subLabel: object.helpText(
                    'Initiative_Activity__c.Initiative_Location__c__Physical'
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
                name: 'Implementation_Stage__c',
                label: object.label(
                    'Initiative_Activity__c.Implementation_Stage__c'
                ),
                subLabel: object.helpText(
                    'Initiative_Activity__c.Implementation_Stage__c'
                ),
                required: true,
                options: pickList(
                    'Initiative_Activity__c.Implementation_Stage__c'
                ),
            },
            {
                type: 'SelectList',
                name: 'Value',
                label: object.label(
                    'Initiative_Activity__c.Financial_Value__c'
                ),
                subLabel: object.helpText(
                    'Initiative_Activity__c.Financial_Value__c'
                ),
                selectLabel: object.label(
                    'Initiative_Activity__c.CurrencyIsoCode'
                ),
                textLabel: object.label(
                    'Initiative_Activity__c.Financial_Value__c__Amount'
                ),
                options: dataSet('Currencies'),
                showText: true,
                listMaxLength: 1,
            },
            {
                type: 'SelectList',
                name: 'Regulations',
                label: object.label('Initiative_Activity_Regulation__c.Name'),
                subLabel: object.helpText(
                    'Initiative_Activity_Regulation__c.Name'
                ),
                options: regulations.map(regulation => ({
                    value: regulation.Id,
                    label: regulation.Name,
                })),
                missingOptionsLabel: label('EmptyStateInputRegulations'),
            },
            {
                type: 'Section',
            },
            {
                type: 'SelectList',
                name: 'Goals',
                label: object.label('Initiative_Goal__c.Goal__c'),
                subLabel: object.helpText('Initiative_Goal__c.Goal__c'),
                options: customGoals.map(goal => ({
                    value: goal.Id,
                    label: goal.Goal__c,
                })),
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
                        addLabel: label('ButtonAddActivityPhysical'),
                        emptyLabel: label(
                            'EmptyStateWizardPageActivitiesPhysical'
                        ),
                    },
                    methods: {
                        add: {
                            title: label(
                                'WizardModalHeadingActivitiesPhysical'
                            ),
                            action: addItem,
                        },
                        edit: {
                            title: label(
                                'WizardModalHeadingActivitiesPhysical'
                            ),
                            action: editItem,
                            setFieldValues: setItemFieldValues,
                        },
                        delete: {
                            title: label(
                                'WizardModalHeadingActivitiesPhysicalDelete'
                            ),
                            text: label(
                                'WizardModalTextActivitiesPhysicalDelete'
                            ),
                            action: deleteItem,
                        },
                    },
                    card: {
                        title(item) {
                            return item?.Things_To_Do__c;
                        },
                        type() {
                            return label('CardTypePhysical');
                        },
                        components(item) {
                            return {
                                cardContent: <ActivityPhysical {...{ item }} />,
                                relatedItems: <ActivityGoals {...{ item }} />,
                                childCollection: (
                                    <ActivitySuccessMetrics {...{ item }} />
                                ),
                                reportUpdate: <Activity {...{ item }} />,
                            };
                        },
                    },
                }}
            />
        </WithPermission>
    );
};

ActivitiesPhysicalComponent.propTypes = {};

ActivitiesPhysicalComponent.defaultProps = {};

ActivitiesPhysicalComponent.layout = 'wizard';

export default WithAuth(ActivitiesPhysicalComponent);
