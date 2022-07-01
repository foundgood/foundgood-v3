// React
import React from 'react';

// Packages

// Utilities
import { useElseware, useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import WithPermission from 'components/withPermission';
import TitlePreamble from 'components/_wizard/titlePreamble';
import ReportUpdatesInPage from 'components/_wizard/reportUpdatesInPage';
import Collection from 'components/_wizard/collection';
import { ReportUpdate } from 'components/_wizard/_cards';

const GoalsComponent = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label, object } = useLabels();
    const { ewUpdate, ewCreate, ewDelete } = useElseware();

    // ///////////////////
    // METHODS
    // ///////////////////

    function getItemData(formData) {
        const { Goal__c } = formData;

        // Data for sf
        return {
            Goal__c,
        };
    }

    async function addItem(formData) {
        const { data: itemData } = await ewCreate(
            'initiative-goal/initiative-goal',
            {
                ...getItemData(formData),
                Initiative__c: utilities.initiative.get().Id,
            }
        );

        // Update main data
        utilities.updateInitiativeData('_goals', itemData);
    }

    async function editItem(formData, id) {
        const { data: itemData } = await ewUpdate(
            'initiative-goal/initiative-goal',
            id,
            getItemData(formData)
        );

        // Update main data
        utilities.updateInitiativeData('_goals', itemData);
    }

    async function deleteItem(id) {
        // Delete
        await ewDelete('initiative-goal/initiative-goal', id);

        // Clean out item
        utilities.removeInitiativeData('_goals', id);
    }

    function setItemFieldValues(form, id) {
        const { Goal__c } = utilities.goals.get(id);

        form.setValue('Goal__c', Goal__c);
    }

    // ///////////////////
    // DATA
    // ///////////////////

    // Get goals
    const goals = utilities.goals.getTypeCustom();

    // ///////////////////
    // FIELDS
    // ///////////////////

    function itemFields() {
        return [
            {
                type: 'LongText',
                name: 'Goal__c',
                label: object.label('Initiative_Goal__c.Goal__c'),
                subLabel: object.helpText('Initiative_Goal__c.Goal__c'),
                required: true,
                maxLength: 200,
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
                    items: goals,
                    itemRelationKey: 'Initiative_Goal__c',
                }}
            />
            <Collection
                {...{
                    collection: {
                        items: goals,
                        fields: itemFields,
                        addLabel: label('ButtonAddGoal'),
                        emptyLabel: label('EmptyStateWizardPageGoals'),
                    },
                    methods: {
                        add: {
                            title: label('WizardModalHeadingGoals'),
                            action: addItem,
                        },
                        edit: {
                            title: label('WizardModalHeadingGoals'),
                            action: editItem,
                            setFieldValues: setItemFieldValues,
                        },
                        delete: {
                            title: label('WizardModalHeadingGoalsDelete'),
                            text: label('WizardModalTextGoalsDelete'),
                            action: deleteItem,
                        },
                    },
                    card: {
                        title(item) {
                            return item?.Goal__c;
                        },
                        type() {
                            return label('CardTypeGoal');
                        },
                        components(item) {
                            return {
                                reportUpdate: (
                                    <ReportUpdate
                                        {...{
                                            title: label(
                                                'ReportUpdateModalGoalsHeading'
                                            ),
                                            reflection: {
                                                item,
                                                relationKey:
                                                    'Initiative_Goal__c',
                                                type:
                                                    CONSTANTS.REPORT_DETAILS
                                                        .GOALS,
                                            },
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

GoalsComponent.propTypes = {};

GoalsComponent.defaultProps = {};

GoalsComponent.layout = 'wizard';

export default WithAuth(GoalsComponent);
