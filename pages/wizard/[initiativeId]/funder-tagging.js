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
import { ChildCollection } from 'components/_wizard/_cards';
import Collection from 'components/_wizard/collection';

const FunderTaggingComponent = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label, object } = useLabels();
    const { ewCreate, ewGetAsync, ewDelete } = useElseware();

    // ///////////////////
    // METHODS
    // ///////////////////

    async function addChildItem(formData) {
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

    async function deleteChildItem(id) {
        // Delete tag collection
        await ewDelete('initiative-tag/initiative-tag', id);

        // Update store
        utilities.removeInitiativeData('_tags', id);
    }

    // ///////////////////
    // DATA
    // ///////////////////

    // Get all funders
    const funders = utilities.funders.getAll();

    // ///////////////////
    // FIELDS
    // ///////////////////

    function childItemFields(item) {
        return [
            {
                type: 'Select',
                name: 'Tag__c',
                label: object.label('Initiative_Tag__c.Tag__c'),
                subLabel: object.helpText('Initiative_Tag__c.Tag__c'),
                async options() {
                    // Get from elsware
                    const { data: funderTags } = await ewGetAsync(
                        'tag/funder-tags',
                        {
                            id: item.Account__c,
                        }
                    );

                    // Get already selected to filter out of options
                    const alreadySelected = utilities.tags
                        .getTypeFromFunderId(
                            CONSTANTS.TAGS.COLLECTION,
                            item.Account__c
                        )
                        .map(tag => tag.Tag__c);

                    // Return filtered array of tag options
                    return Object.values(funderTags ?? {})
                        .filter(tag => !alreadySelected.includes(tag.Id))
                        .map(tag => ({
                            label: tag.Name,
                            value: tag.Id,
                        }));
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
            <Collection
                {...{
                    collection: {
                        items: funders,
                        emptyLabel: label('EmptyStateWizardPageActivities'),
                    },
                    card: {
                        title(item) {
                            return item?.Account__r?.Name;
                        },
                        type() {
                            return label('CardTypeFunder');
                        },
                        components(item) {
                            return {
                                childCollection: (
                                    <ChildCollection
                                        {...{
                                            title: label(
                                                'ChildCollectionHeadingFunderTagging'
                                            ),
                                            item,
                                            methods: {
                                                add: {
                                                    title: label(
                                                        'WizardModalHeadingFunderTagging'
                                                    ),
                                                    action: addChildItem,
                                                },
                                                delete: {
                                                    title: label(
                                                        'WizardModalHeadingFunderTaggingDelete'
                                                    ),
                                                    text: label(
                                                        'WizardModalTextFunderTaggingDelete'
                                                    ),
                                                    action: deleteChildItem,
                                                },
                                            },
                                            collection: {
                                                title(childItem) {
                                                    return childItem?.Tag__r
                                                        ?.Name;
                                                },
                                                items(item) {
                                                    return utilities.tags.getTypeFromFunderId(
                                                        CONSTANTS.TAGS
                                                            .COLLECTION,
                                                        item.Account__c
                                                    );
                                                },
                                                fields: childItemFields,
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

FunderTaggingComponent.propTypes = {};

FunderTaggingComponent.defaultProps = {};

FunderTaggingComponent.layout = 'wizard';

export default WithAuth(FunderTaggingComponent);
