// React
import React from 'react';

// Packages

// Utilities
import { useElseware, useLabels, useWizardSubmit } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import WithPermission from 'components/withPermission';
import TitlePreamble from 'components/_wizard/titlePreamble';
import { InputWrapper } from 'components/_inputs';
import { BaseCard, ChildCollection } from 'components/_cards';

const FunderTaggingComponent = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label, object } = useLabels();
    const { ewCreate, ewGet, ewDelete } = useElseware();

    // ///////////////////
    // STATE
    // ///////////////////

    // ///////////////////
    // SUBMIT
    // ///////////////////

    useWizardSubmit();

    // ///////////////////
    // METHODS
    // ///////////////////

    function tagSelectAsyncOptions(id) {
        // Get data for form
        const { data: funderTags } = ewGet('tags/funder-tags', {
            id,
        });

        return Object.values(funderTags?.data ?? {}).map(list => ({
            label: list.Name,
            value: list.Id,
        }));
    }

    async function addTaggingCollection(formData) {
        const { Tag__c } = formData;

        // Data for sf
        const data = {
            Tag__c,
            Initiative__c: utilities.initiative.get().Id,
        };

        // Create initiative tag list collections
        const { data: initiativeTagData } = await ewCreate(
            'initiative-tag/initiative-tag',
            data
        );

        // Update data in initiative
        utilities.updateInitiativeData('_tags', initiativeTagData);
    }

    async function deleteTaggingCollection(id) {
        // Delete tag collection
        await ewDelete('initiative-tag/initiative-tag', id);

        // Update store
        utilities.removeInitiativeDataRelations(
            '_tags',
            item => item.Id === id
        );
    }

    // ///////////////////
    // DATA
    // ///////////////////

    // Get all funders
    const funders = utilities.funders.getAll();

    // ///////////////////
    // FIELDS
    // ///////////////////

    function taggingCollectionFields(item) {
        return [
            {
                type: 'Select',
                name: 'Tag__c',
                label: object.label('Initiative_Tag__c.Tag__c'),
                // Type options
                subLabel: object.helpText('Initiative_Tag__c.Tag__c'),
                asyncOptions() {
                    return tagSelectAsyncOptions(item.Account__c);
                },
            },
        ];
    }

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <WithPermission context>
            <TitlePreamble />
            <InputWrapper>
                {funders.map(item => (
                    <BaseCard
                        key={item.Id}
                        {...{
                            title: item?.Account__r?.Name,
                            type: label('CardFunderType'),
                            components: {
                                childCollection: (
                                    <ChildCollection
                                        {...{
                                            title: label(
                                                'CardFunderTaggingCollectionsHeading'
                                            ),
                                            methods: {
                                                add: {
                                                    title:
                                                        'WizardModalHeadingFunderTagging',
                                                    action: addTaggingCollection,
                                                },
                                                delete: {
                                                    title:
                                                        'WizardModalHeadingFunderTaggingDelete',
                                                    text:
                                                        'WizardModalTextFunderTaggingDelete',
                                                    action: deleteTaggingCollection,
                                                },
                                            },
                                            collection: {
                                                title(x) {
                                                    return x?.Tag__r?.Name;
                                                },
                                                items: utilities.tags.getTypeFromFunderId(
                                                    'COLLECTION',
                                                    item.Account__c
                                                ),
                                                fields: taggingCollectionFields(
                                                    item
                                                ),
                                            },
                                        }}
                                    />
                                ),
                            },
                        }}
                    />
                ))}
            </InputWrapper>
        </WithPermission>
    );
};

FunderTaggingComponent.propTypes = {};

FunderTaggingComponent.defaultProps = {};

FunderTaggingComponent.layout = 'wizard';

export default WithAuth(FunderTaggingComponent);
