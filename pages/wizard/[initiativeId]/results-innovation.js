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
import ResultsInnovation from 'components/_wizard/_cards/_cardContents/resultsInnovation';
import ResultActivities from 'components/_wizard/_cards/_relatedItems/resultActivities';
import Result from 'components/_wizard/_cards/_reportUpdates/result';

const ResultsInnovationComponent = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label, object, pickList } = useLabels();
    const { ewUpdate, ewCreate, ewDelete } = useElseware();

    // ///////////////////
    // METHODS
    // ///////////////////

    function getItemData(formData) {
        const {
            Name,
            Description__c,
            Activities,
            Innovation_Type__c,
            URL__c,
        } = formData;

        // Data for sf
        return {
            Type__c: CONSTANTS.RESULTS.INNOVATION,
            Name,
            Description__c,
            Innovation_Type__c,
            URL__c,
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
        const {
            Name,
            Description__c,
            Innovation_Type__c,
            URL__c,
        } = utilities.results.get(id);

        form.setValue('Name', Name);
        form.setValue('Description__c', Description__c);
        form.setValue('Innovation_Type__c', Innovation_Type__c);
        form.setValue('URL__c', URL__c);

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
    const results = utilities.results.getTypeInnovation();

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
                type: 'Select',
                name: 'Innovation_Type__c',
                label: object.label('Initiative_Result__c.Innovation_Type__c'),
                subLabel: object.helpText(
                    'Initiative_Result__c.Innovation_Type__c'
                ),
                options: pickList('Initiative_Result__c.Innovation_Type__c'),
                required: true,
            },
            {
                type: 'Text',
                name: 'URL__c',
                label: object.label('Initiative_Result__c.URL__c'),
                subLabel: object.helpText('Initiative_Result__c.URL__c'),
                maxLength: 200,
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
                        addLabel: label('ButtonAddResultsInnovation'),
                        emptyLabel: label(
                            'EmptyStateWizardPageResultsInnovation'
                        ),
                    },
                    methods: {
                        add: {
                            title: label('WizardModalHeadingResultsInnovation'),
                            action: addItem,
                        },
                        edit: {
                            title: label('WizardModalHeadingResultsInnovation'),
                            action: editItem,
                            setFieldValues: setItemFieldValues,
                        },
                        delete: {
                            title: label(
                                'WizardModalHeadingResultsInnovationDelete'
                            ),
                            text: label(
                                'WizardModalTextResultsInnovationDelete'
                            ),
                            action: deleteItem,
                        },
                    },
                    card: {
                        title(item) {
                            return item?.Name;
                        },
                        type() {
                            return label('CardTypeResultsInnovation');
                        },
                        components(item) {
                            return {
                                cardContent: (
                                    <ResultsInnovation {...{ item }} />
                                ),
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

ResultsInnovationComponent.propTypes = {};

ResultsInnovationComponent.defaultProps = {};

ResultsInnovationComponent.layout = 'wizard';

export default WithAuth(ResultsInnovationComponent);
