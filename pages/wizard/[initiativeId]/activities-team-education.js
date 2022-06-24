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
import ActivityTeamEducation from 'components/_wizard/_cards/_cardContents/activityTeamEducation';
import ActivitySuccessMetrics from 'components/_wizard/_cards/_childCollections/activitySuccessMetrics';
import ActivityGoals from 'components/_wizard/_cards/_relatedItems/activityGoals';
import Activity from 'components/_wizard/_cards/_reportUpdates/activity';

const ActivitiesTeamEducationComponent = () => {
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
            Education_Type__c,
            Employees,
            Goals,
        } = formData;

        // Data for sf
        return {
            Activity_Type__c: CONSTANTS.ACTIVITIES.TEAM_EDUCATION,
            Things_To_Do__c,
            Things_To_Do_Description__c,
            Initiative_Location__c: Location[0]?.selectValue,
            Additional_Location_Information__c: Location[0]?.textValue,
            Education_Type__c,
            activityEmployees: Employees.map(item => item.selectValue),
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
        const { _activityGoals, _activityEmployees, ...rest } = itemData;

        // Update main data
        utilities.updateInitiativeData('_activities', rest);

        // Updated related data
        utilities.updateInitiativeDataRelations(
            '_activityGoals',
            _activityGoals
        );
        utilities.updateInitiativeDataRelations(
            '_activityEmployees',
            _activityEmployees
        );
    }

    async function editItem(formData, id) {
        const { data: itemData } = await ewUpdate(
            'initiative-activity/initiative-activity-and-children',
            id,
            getItemData(formData)
        );

        // Destructure response
        const { _activityGoals, _activityEmployees, ...rest } = itemData;

        // Clean out existing related data
        utilities.removeInitiativeDataRelations(
            '_activityGoals',
            item => item.Initiative_Activity__c === id
        );
        utilities.removeInitiativeDataRelations(
            '_activityEmployees',
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
            '_activityEmployees',
            _activityEmployees
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
            '_activityEmployees',
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
            Education_Type__c,
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
        form.setValue('Education_Type__c', Education_Type__c);

        // Employees
        form.setValue(
            'Employees',
            utilities.activityEmployees
                .getFromActivityId(Id)
                .map(activityEmployee => ({
                    selectValue: activityEmployee.Initiative_Employee_Funded__c,
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

    // Get employees
    const employees = utilities.employeesFunded.getAll();

    // Get activities
    const activities = utilities.activities.getTypeTeamEducation();

    // ///////////////////
    // FIELDS
    // ///////////////////

    function itemFields() {
        return [
            {
                type: 'Text',
                name: 'Things_To_Do__c',
                label: object.label(
                    'Initiative_Activity__c.Things_To_Do__c__TeamEducation'
                ),
                subLabel: object.helpText(
                    'Initiative_Activity__c.Things_To_Do__c__TeamEducation'
                ),
                required: true,
                maxLength: 200,
            },
            {
                type: 'LongText',
                name: 'Things_To_Do_Description__c',
                label: object.label(
                    'Initiative_Activity__c.Things_To_Do_Description__c__TeamEducation'
                ),
                subLabel: object.helpText(
                    'Initiative_Activity__c.Things_To_Do_Description__c__TeamEducation'
                ),
                maxLength: 400,
            },
            {
                type: 'SelectList',
                name: 'Location',
                label: object.label(
                    'Initiative_Activity__c.Initiative_Location__c__TeamEducation'
                ),
                subLabel: object.helpText(
                    'Initiative_Activity__c.Initiative_Location__c__TeamEducation'
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
                name: 'Education_Type__c',
                label: object.label('Initiative_Activity__c.Education_Type__c'),
                subLabel: object.helpText(
                    'Initiative_Activity__c.Education_Type__c'
                ),
                required: true,
                options: pickList('Initiative_Activity__c.Education_Type__c'),
            },
            {
                type: 'SelectList',
                name: 'Employees',
                label: object.label(
                    'Initiative_Activity_Regulation__c.Employee__c'
                ),
                subLabel: object.helpText(
                    'Initiative_Activity_Regulation__c.Employee__c'
                ),
                options: employees.map(employee => ({
                    value: employee.Id,
                    label: `${employee.Full_Name__c} - ${employee.Job_Title__c}`,
                })),
                missingOptionsLabel: label('EmptyStateInputEmployeesFunded'),
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
                        addLabel: label('ButtonAddActivityTeamEducation'),
                        emptyLabel: label(
                            'EmptyStateWizardPageActivitiesTeamEducation'
                        ),
                    },
                    methods: {
                        add: {
                            title: label(
                                'WizardModalHeadingActivitiesTeamEducation'
                            ),
                            action: addItem,
                        },
                        edit: {
                            title: label(
                                'WizardModalHeadingActivitiesTeamEducation'
                            ),
                            action: editItem,
                            setFieldValues: setItemFieldValues,
                        },
                        delete: {
                            title: label(
                                'WizardModalHeadingActivitiesTeamEducationDelete'
                            ),
                            text: label(
                                'WizardModalTextActivitiesTeamEducationDelete'
                            ),
                            action: deleteItem,
                        },
                    },
                    card: {
                        title(item) {
                            return item?.Things_To_Do__c;
                        },
                        type() {
                            return label('CardTypeActivityTeamEducation');
                        },
                        components(item) {
                            return {
                                cardContent: (
                                    <ActivityTeamEducation {...{ item }} />
                                ),
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

ActivitiesTeamEducationComponent.propTypes = {};

ActivitiesTeamEducationComponent.defaultProps = {};

ActivitiesTeamEducationComponent.layout = 'wizard';

export default WithAuth(ActivitiesTeamEducationComponent);
