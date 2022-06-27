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
import ResultsResearch from 'components/_wizard/_cards/_cardContents/resultsResearch';
import ResultActivities from 'components/_wizard/_cards/_relatedItems/resultActivities';
import Result from 'components/_wizard/_cards/_reportUpdates/result';

const ResultsResearchComponent = () => {
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
        const {
            Name,
            Description__c,
            Publication_Type__c,
            Year__c,
            Publisher__c,
            Author__c,
            DOI__c,
            URL_c,
            Publication_Title__c,
            Activities,
        } = formData;

        // Data for sf
        return {
            Type__c: CONSTANTS.RESULTS.RESEARCH,
            Name,
            Description__c,
            Publication_Type__c,
            Year__c,
            Publisher__c,
            Author__c,
            DOI__c,
            URL_c,
            Publication_Title__c,
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
            Publication_Type__c,
            Year__c,
            Publisher__c,
            Author__c,
            DOI__c,
            URL_c,
            Publication_Title__c,
        } = utilities.results.get(id);

        form.setValue('Name', Name);
        form.setValue('Description__c', Description__c);
        form.setValue('Publication_Type__c', Publication_Type__c);
        form.setValue('Year__c', Year__c);
        form.setValue('Publisher__c', Publisher__c);
        form.setValue('Author__c', Author__c);
        form.setValue('DOI__c', DOI__c);
        form.setValue('URL_c', URL_c);
        form.setValue('Publication_Title__c', Publication_Title__c);

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

    // Activities
    const activities = utilities.activities.getAll();

    // Get results
    const results = utilities.results.getTypeResearch();

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
                type: 'Text',
                name: 'Publication_Type__c',
                label: object.label('Initiative_Result__c.Publication_Type__c'),
                subLabel: object.helpText(
                    'Initiative_Result__c.Publication_Type__c'
                ),
                maxLength: 30,
            },
            {
                type: 'Select',
                name: 'Year__c',
                label: object.label('Initiative_Result__c.Year__c'),
                subLabel: object.helpText('Initiative_Result__c.Year__c'),
                options: getYears(),
            },
            {
                type: 'Text',
                name: 'Publisher__c',
                label: object.label('Initiative_Result__c.Publisher__c'),
                subLabel: object.helpText('Initiative_Result__c.Publisher__c'),
                maxLength: 200,
            },
            {
                type: 'Text',
                name: 'Author__c',
                label: object.label('Initiative_Result__c.Author__c'),
                subLabel: object.helpText('Initiative_Result__c.Author__c'),
                maxLength: 80,
            },
            {
                type: 'Text',
                name: 'DOI__c',
                label: object.label('Initiative_Result__c.DOI__c'),
                subLabel: object.helpText('Initiative_Result__c.DOI__c'),
                maxLength: 30,
            },
            {
                type: 'Text',
                name: 'URL_c',
                label: object.label('Initiative_Result__c.URL_c'),
                subLabel: object.helpText('Initiative_Result__c.URL_c'),
                maxLength: 80,
            },
            {
                type: 'Text',
                name: 'Publication_Title__c',
                label: object.label(
                    'Initiative_Result__c.Publication_Title__c'
                ),
                subLabel: object.helpText(
                    'Initiative_Result__c.Publication_Title__c'
                ),
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
                        addLabel: label('ButtonAddResultsResearch'),
                        emptyLabel: label(
                            'EmptyStateWizardPageResultsResearch'
                        ),
                    },
                    methods: {
                        add: {
                            title: label('WizardModalHeadingResultsResearch'),
                            action: addItem,
                        },
                        edit: {
                            title: label('WizardModalHeadingResultsResearch'),
                            action: editItem,
                            setFieldValues: setItemFieldValues,
                        },
                        delete: {
                            title: label(
                                'WizardModalHeadingResultsResearchDelete'
                            ),
                            text: label('WizardModalTextResultsResearchDelete'),
                            action: deleteItem,
                        },
                    },
                    card: {
                        title(item) {
                            return item?.Name;
                        },
                        type() {
                            return label('CardTypeResultsResearch');
                        },
                        components(item) {
                            return {
                                cardContent: <ResultsResearch {...{ item }} />,
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

ResultsResearchComponent.propTypes = {};

ResultsResearchComponent.defaultProps = {};

ResultsResearchComponent.layout = 'wizard';

export default WithAuth(ResultsResearchComponent);
