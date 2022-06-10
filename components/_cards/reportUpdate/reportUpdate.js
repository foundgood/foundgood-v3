// React
import React from 'react';

// Packages
import t from 'prop-types';
import { useForm } from 'react-hook-form';

// Utilities
import {
    useContext,
    useElseware,
    useLabels,
    useModalState,
} from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import Button from 'components/button';
import ReportUpdateModal from 'components/_modals/reportUpdateModal';

// Icons
import { FiTrendingUp, FiMessageCircle, FiTag } from 'react-icons/fi';

const ReportUpdateComponent = ({
    title,
    metrics,
    reflection,
    tagging,
    status,
}) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { REPORT_ID } = useContext();
    const { label } = useLabels();
    const {
        ewCreate,
        ewCreateUpdateWrapper,
        ewDelete,
        ewGetAsync,
    } = useElseware();
    const {
        modalState,
        modalOpen,
        modalClose,
        modalSaving,
        modalNotSaving,
    } = useModalState();

    // ///////////////////
    // FORMS
    // ///////////////////

    const mainForm = useForm();

    // ///////////////////
    // METHODS
    // ///////////////////

    async function submitTagging(formData) {
        // Collect tagging data based on selects
        let tagsData = [];
        for (const taggingCollection of taggingCollections) {
            // Get selectLists from formData from dynamic naming
            const taggingSelect =
                formData[`taggingSelect-${taggingCollection.Tag__c}`];

            // Add tags to tagsData from each of the selectLists
            for (const tag of taggingSelect) {
                tagsData.push({
                    [tagging.relationKey]: tagging.item.Id,
                    Tag__c: tag.selectValue,
                });
            }
        }

        // Based on current tags, extract new tags and tags to be deleted in two different arrays
        // Tags to be added = if they do not exist in currentTags
        const tagsToBeAdded =
            currentTags.length > 0
                ? tagsData.filter(
                      tag =>
                          !currentTags.map(x => x.Tag__c).includes(tag.Tag__c)
                  )
                : tagsData;

        // Tags that remains = if they exist in currentTags (helper)
        const tagsToRemain = tagsData.filter(tag =>
            currentTags.map(x => x.Tag__c).includes(tag.Tag__c)
        );

        // Tags to be deleted = if a currentTag is not part of tagsToRemain
        const tagsToBeDeleted = currentTags
            .filter(
                tag => !tagsToRemain.map(x => x.Tag__c).includes(tag.Tag__c)
            )
            // Format to fit elseware
            .map(tag => tag.Id);

        // Delete from store
        tagsToBeDeleted.forEach(tagId =>
            utilities.removeInitiativeData('_tags', tagId)
        );

        // Create/delete initiative tags (POST)
        const initiativeTagsData = await ewCreate(
            'initiative-tag/initiative-tags-bulk',
            {
                Initiative__c: utilities.initiative.get().Id,
                tags: tagsToBeAdded,
                removeTags: tagsToBeDeleted,
            }
        );

        // Update tags in initiative with new tags
        Object.values(initiativeTagsData).forEach(tagData =>
            utilities.updateInitiativeData('_tags', tagData)
        );
    }

    async function submitReflection(formData) {
        const { reflectionDescription } = formData;

        // Only do stuff reflection if added or already existing
        if (
            currentReflection?.Description__c?.length > 0 ||
            reflectionDescription?.length > 0
        ) {
            // Check if it should be deleted (length on current = 0)
            if (reflectionDescription.length === 0) {
                // Delete reflection
                await ewDelete(
                    'initiative-report-detail/initiative-report-detail',
                    currentReflection?.Id
                );

                // Remove from store
                utilities.removeInitiativeData(
                    '_reportDetails',
                    currentReflection?.Id
                );
            } else {
                // Create/Update reflection
                await ewCreateUpdateWrapper(
                    'initiative-report-detail/initiative-report-detail',
                    currentReflection?.Id,
                    {
                        Description__c: reflectionDescription,
                    },
                    {
                        [reflection.relationKey]: reflection.item?.Id,
                        Type__c: reflection.type,
                        Initiative_Report__c: REPORT_ID,
                    },
                    '_reportDetails'
                );
            }
        }
    }

    async function submit(formData) {
        // Modal save button state
        modalSaving();
        try {
            // Tags
            if (tagging) {
                await submitTagging(formData);
            }

            // Status
            if (status) {
                // TODO
            }

            // Success Metrics
            if (metrics) {
                // TODO
            }

            // Reflection
            if (reflection) {
                await submitReflection(formData);
            }

            // Close modal
            modalClose();

            // Modal save button state
            modalNotSaving();

            // Clear content in form
            mainForm.reset();
        } catch (error) {
            // Modal save button state
            modalNotSaving();
            console.warn(error);
        }
    }

    // ///////////////////
    // DATA - TAGGING
    // ///////////////////

    // Get funder id
    const funderId = utilities.reports.get(REPORT_ID)?.Funder_Report__r
        ?.Account__r?.Id;

    // Get collections from funder
    const taggingCollections = utilities.tags.getTypeFromFunderId(
        CONSTANTS.TAGS.COLLECTION,
        funderId
    );

    // Get current tags if any
    const currentTags = utilities.tags.getFromRelationKeyId(
        tagging.relationKey,
        tagging.item?.Id
    );

    // ///////////////////
    // DATA - REFLECTION
    // ///////////////////

    // Current report details (reflections)
    const reportDetails = utilities.reportDetails.getFromReportId(REPORT_ID);

    // Get current reflection based on relationKey if any
    const currentReflection = reflection
        ? reportDetails.find(
              reportDetail =>
                  reportDetail[reflection.relationKey] === reflection.item.Id
          )
        : null;

    // ///////////////////
    // DATA
    // ///////////////////

    // Any updates?
    const hasUpdate = [currentReflection, currentTags.length > 0].some(x => x);

    // ///////////////////
    // FIELDS
    // ///////////////////

    const fields = [
        ...(tagging
            ? taggingCollections.map(taggingCollection => ({
                  type: 'SelectList',
                  name: `taggingSelect-${taggingCollection.Tag__c}`,
                  label: `${label(`ReportUpdateModal${tagging.type}TagLabel`)}`,
                  defaultValue: currentTags
                      .filter(
                          tag =>
                              tag.Tag__r?.Collection__c ===
                              taggingCollection.Tag__c
                      )
                      .map(tag => ({
                          selectValue: tag.Tag__r?.Id,
                      })),
                  // Type options
                  listMaxLength: 3,
                  async options() {
                      const tagOptions = await ewGetAsync(
                          'tag/tag-collection',
                          {
                              id: taggingCollection.Tag__r?.Id,
                              type: tagging.type,
                          }
                      );

                      return Object.values(tagOptions?.data ?? {}).map(tag => ({
                          label: tag.Name,
                          value: tag.Id,
                      }));
                  },
                  subLabel: taggingCollection.Account_Name__c,
              }))
            : []),
        ...(reflection
            ? [
                  {
                      type: 'Reflection',
                      name: 'reflectionDescription',
                      label: label('ReportUpdateModalReflectionsLabel'),
                      defaultValue: currentReflection?.Description__c,
                      // Type options
                      maxLength: 750,
                  },
              ]
            : []),
    ];
    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <>
            {/* Show updates if they are there */}
            {hasUpdate ? (
                <div className="flex justify-between w-full p-8 rounded-8 bg-blue-20">
                    <div className="flex items-center px-8 space-x-12 text-blue-300">
                        {/* Tags */}
                        {currentTags.length > 0 && (
                            <div className="flex items-center space-x-8">
                                <FiTag className="w-24 h-24" />
                                <span className="relative top-2">
                                    {currentTags.length}
                                </span>
                            </div>
                        )}
                        {/* Reflection */}
                        {currentReflection && (
                            <FiMessageCircle className="w-24 h-24" />
                        )}
                    </div>
                    <Button variant="secondary" theme="blue" action={modalOpen}>
                        {label('ButtonEdit')}
                    </Button>
                </div>
            ) : (
                <div className="flex justify-end space-x-8">
                    <Button variant="secondary" theme="teal" action={modalOpen}>
                        {label('BaseCardButtonUpdateReport')}
                    </Button>
                </div>
            )}

            <ReportUpdateModal
                {...{
                    title,
                    form: mainForm,
                    fields,
                    onCancel() {
                        modalClose();
                    },
                    async onSave() {
                        await mainForm.handleSubmit(
                            async data => await submit(data)
                        )();
                    },
                    ...modalState,
                }}
            />
        </>
    );
};

ReportUpdateComponent.propTypes = {
    title: t.string.isRequired,
    reflection: t.shape({
        item: t.object.isRequired,
        relationKey: t.string.isRequired,
        type: t.string.isRequired,
    }),
    tagging: t.shape({
        item: t.object.isRequired,
        relationKey: t.string.isRequired,
        type: t.string.isRequired,
    }),
};

ReportUpdateComponent.defaultProps = {
    title: '',
    reflection: null,
    tagging: null,
    status: null,
    metrics: null,
};

export default ReportUpdateComponent;
