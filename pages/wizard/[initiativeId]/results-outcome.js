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

// Components shared for results
import ResultsOutcome from 'components/_wizard/_cards/_cardContents/resultsOutcome';
import ResultGoals from 'components/_wizard/_cards/_relatedItems/resultGoals';
import Result from 'components/_wizard/_cards/_reportUpdates/result';

const ResultsOutcomeComponent = () => {
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
        const { Name, Description__c, Goals } = formData;

        // Data for sf
        return {
            Type__c: CONSTANTS.RESULTS.CUSTOM_OUTCOME,
            Name,
            Description__c,
            resultGoals: Goals.map(item => item.selectValue),
        };
    }

    async function addItem(formData) {
        const { data: itemData } = await ewCreate(
            'initiative-result/initiative-result-and-children',
            {
                ...getItemData(formData),
                Initiative__c: utilities.initiative.get().Id,
            }
        );

        // Destructure response
        const { resultGoals, ...rest } = itemData;

        // Update main data
        utilities.updateInitiativeData('_results', rest);

        // Updated related data
        utilities.updateInitiativeDataRelations('_resultGoals', resultGoals);
    }

    async function editItem(formData, id) {
        const { data: itemData } = await ewUpdate(
            'initiative-result/initiative-result-and-children',
            id,
            getItemData(formData)
        );

        // Destructure response
        const { resultGoals, ...rest } = itemData;

        // Clean out existing related data
        utilities.removeInitiativeDataRelations(
            '_resultGoals',
            item => item.Initiative_Result__c === id
        );

        // Update main data
        utilities.updateInitiativeData('_results', rest);

        // Updated related data
        utilities.updateInitiativeDataRelations('_resultGoals', resultGoals);
    }

    async function deleteItem(id) {
        // Delete
        await ewDelete('initiative-result/initiative-result-and-children', id);

        // Clean out item
        utilities.removeInitiativeData('_results', id);

        // Clean out existing related data
        utilities.removeInitiativeDataRelations(
            '_resultGoals',
            item => item.Initiative_Result__c === id
        );
    }

    function setItemFieldValues(form, id) {
        const { Name, Description__c } = utilities.results.get(id);

        form.setValue('Name', Name);
        form.setValue('Description__c', Description__c);

        // Goals
        form.setValue(
            'Goals',
            utilities.resultGoals.getFromResultId(id).map(resultGoal => ({
                selectValue: resultGoal.Initiative_Goal__c,
            }))
        );
    }

    // ///////////////////
    // DATA
    // ///////////////////

    // Goals
    const goals = utilities.goals.getTypeCustom();

    // Get results
    const results = utilities.results.getTypeCustomOutcome();

    // ///////////////////
    // FIELDS
    // ///////////////////

    function itemFields() {
        return [
            {
                type: 'Text',
                name: 'Name',
                label: object.label('Initiative_Result__c.Name'),
                subLabel: object.helpText('Initiative_Result__c.Name'),
                required: true,
                maxLength: 80,
            },
            {
                type: 'LongText',
                name: 'Description__c',
                label: object.label('Initiative_Result__c.Description__c'),
                subLabel: object.helpText(
                    'Initiative_Result__c.Description__c'
                ),
                maxLength: 400,
                required: true,
            },
            {
                type: 'Section',
            },
            {
                type: 'SelectList',
                name: 'Goals',
                label: object.label('Initiative_Result__c.Related_Goal'),
                subLabel: object.helpText('Initiative_Result__c.Related_Goal'),
                options: goals.map(goal => ({
                    value: goal.Id,
                    label: goal.Goal__c,
                })),
                missingOptionsLabel: label('EmptyStateInputActivities'),
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
                    items: results,
                    itemRelationKey: 'Initiative_Result__c',
                }}
            />
            <Collection
                {...{
                    collection: {
                        items: results,
                        fields: itemFields,
                        addLabel: label('ButtonAddResultsOutcome'),
                        emptyLabel: label('EmptyStateWizardPageResultsOutcome'),
                    },
                    methods: {
                        add: {
                            title: label('WizardModalHeadingResultsOutcome'),
                            action: addItem,
                        },
                        edit: {
                            title: label('WizardModalHeadingResultsOutcome'),
                            action: editItem,
                            setFieldValues: setItemFieldValues,
                        },
                        delete: {
                            title: label(
                                'WizardModalHeadingResultsOutcomeDelete'
                            ),
                            text: label('WizardModalTextResultsOutcomeDelete'),
                            action: deleteItem,
                        },
                    },
                    card: {
                        title(item) {
                            return item?.Name;
                        },
                        type() {
                            return label('CardTypeResultsOutcome');
                        },
                        components(item) {
                            return {
                                cardContent: <ResultsOutcome {...{ item }} />,
                                relatedItems: <ResultGoals {...{ item }} />,
                                reportUpdate: (
                                    <Result
                                        {...{
                                            item,
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

ResultsOutcomeComponent.propTypes = {};

ResultsOutcomeComponent.defaultProps = {};

ResultsOutcomeComponent.layout = 'wizard';

export default WithAuth(ResultsOutcomeComponent);
