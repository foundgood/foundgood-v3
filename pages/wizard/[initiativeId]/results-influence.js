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
import ResultsInfluence from 'components/_wizard/_cards/_cardContents/resultsInfluence';
import ResultActivities from 'components/_wizard/_cards/_relatedItems/resultActivities';
import Result from 'components/_wizard/_cards/_reportUpdates/result';

const ResultsInfluenceComponent = () => {
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
        const { Name, Description__c, Activities } = formData;

        // Data for sf
        return {
            Type__c: CONSTANTS.RESULTS.INFLUENCE_ON_POLICY,
            Name,
            Description__c,
            resultActivities: Activities.map(item => item.selectValue),
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
        const { _resultActivities, ...rest } = itemData;

        // Update main data
        utilities.updateInitiativeData('_results', rest);

        // Updated related data
        utilities.updateInitiativeDataRelations(
            '_resultActivities',
            _resultActivities
        );
    }

    async function editItem(formData, id) {
        const { data: itemData } = await ewUpdate(
            'initiative-result/initiative-result-and-children',
            id,
            getItemData(formData)
        );

        // Destructure response
        const { _resultActivities, ...rest } = itemData;

        // Clean out existing related data
        utilities.removeInitiativeDataRelations(
            '_resultActivities',
            item => item.Initiative_Result__c === id
        );

        // Update main data
        utilities.updateInitiativeData('_results', rest);

        // Updated related data
        utilities.updateInitiativeDataRelations(
            '_resultActivities',
            _resultActivities
        );
    }

    async function deleteItem(id) {
        // Delete
        await ewDelete('initiative-result/initiative-result-and-children', id);

        // Clean out item
        utilities.removeInitiativeData('_results', id);

        // Clean out existing related data
        utilities.removeInitiativeDataRelations(
            '_resultActivities',
            item => item.Initiative_Result__c === id
        );
    }

    function setItemFieldValues(form, id) {
        const { Name, Description__c } = utilities.results.get(id);

        form.setValue('Name', Name);
        form.setValue('Description__c', Description__c);

        // Activities
        form.setValue(
            'Activities',
            utilities.resultActivities
                .getFromResultId(id)
                .map(resultActivity => ({
                    selectValue: resultActivity.Initiative_Activity__c,
                }))
        );
    }

    // ///////////////////
    // DATA
    // ///////////////////

    // Activities
    const activities = utilities.activities.getAll();

    // Get results
    const results = utilities.results.getTypeInfluenceOnPolicy();

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
                name: 'Activities',
                label: object.label('Initiative_Result__c.Related_Activity'),
                subLabel: object.helpText(
                    'Initiative_Result__c.Related_Activity'
                ),
                options: activities.map(activity => ({
                    value: activity.Id,
                    label: activity.Things_To_Do__c,
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
                        addLabel: label('ButtonAddResultsInfluence'),
                        emptyLabel: label(
                            'EmptyStateWizardPageResultsInfluence'
                        ),
                    },
                    methods: {
                        add: {
                            title: label('WizardModalHeadingResultsInfluence'),
                            action: addItem,
                        },
                        edit: {
                            title: label('WizardModalHeadingResultsInfluence'),
                            action: editItem,
                            setFieldValues: setItemFieldValues,
                        },
                        delete: {
                            title: label(
                                'WizardModalHeadingResultsInfluenceDelete'
                            ),
                            text: label(
                                'WizardModalTextResultsInfluenceDelete'
                            ),
                            action: deleteItem,
                        },
                    },
                    card: {
                        title(item) {
                            return item?.Name;
                        },
                        type() {
                            return label('CardTypeResultsInfluence');
                        },
                        components(item) {
                            return {
                                cardContent: <ResultsInfluence {...{ item }} />,
                                relatedItems: (
                                    <ResultActivities {...{ item }} />
                                ),
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

ResultsInfluenceComponent.propTypes = {};

ResultsInfluenceComponent.defaultProps = {};

ResultsInfluenceComponent.layout = 'wizard';

export default WithAuth(ResultsInfluenceComponent);
