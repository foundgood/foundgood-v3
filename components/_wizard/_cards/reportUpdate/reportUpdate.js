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
import {
    FiActivity,
    FiTrendingUp,
    FiMessageCircle,
    FiTag,
} from 'react-icons/fi';

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
    const { label, object, pickList } = useLabels();
    const {
        ewCreate,
        ewCreateUpdateWrapper,
        ewUpdate,
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

    async function submitStatus(formData) {
        const { Status__c, Completion_Date__c, Status_Comments__c } = formData;

        // Only do stuff if content is there
        if (Status__c || Completion_Date__c || Status_Comments__c) {
            // Create/Update reflection
            await ewCreateUpdateWrapper(
                'initiative-report-detail/initiative-report-detail',
                currentStatus?.Id,
                {
                    Status__c,
                    Completion_Date__c,
                    Status_Comments__c,
                },
                {
                    [status.relationKey]: status.item?.Id,
                    Type__c: status.type,
                    Initiative_Report__c: REPORT_ID,
                },
                '_reportDetails'
            );
        }
    }

    async function submitMetrics(formData) {
        const { metricsList } = formData;
        // Only do stuff if metricsList is part of formData
        if (metricsList) {
            // Look through metricsList and create promises to update metric, also add acquired data to initiative
            await Promise.all(
                Object.entries(metricsList).map(async ([id, value]) => {
                    const { data } = await ewUpdate(
                        'initiative-activity-success-metric/initiative-activity-success-metric',
                        id,
                        {
                            Current_Status__c: value,
                        }
                    );

                    // Add updated data to initiative
                    utilities.updateInitiativeData(
                        '_activitySuccessMetrics',
                        data
                    );
                })
            );
        }
    }

    async function submitReflection(formData) {
        const { Description__c } = formData;

        // Only do stuff reflection if added or already existing
        if (
            currentReflection?.Description__c?.length > 0 ||
            Description__c?.length > 0
        ) {
            // Create/Update reflection
            await ewCreateUpdateWrapper(
                'initiative-report-detail/initiative-report-detail',
                currentReflection?.Id,
                {
                    Description__c,
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

    async function submitReflectionAndStatus(formData) {
        const {
            Completion_Date__c,
            Description__c,
            Status__c,
            Status_Comments__c,
        } = formData;

        // Only do stuff reflection/status if added or already existing
        if (
            Completion_Date__c ||
            currentReflection?.Description__c ||
            Description__c ||
            Status__c ||
            Status_Comments__c ||
            currentReflection?.Status_Comments__c
        ) {
            // Create/Update reflection
            await ewCreateUpdateWrapper(
                'initiative-report-detail/initiative-report-detail',
                currentReflection?.Id,
                {
                    Description__c,
                    Status__c,
                    Completion_Date__c,
                    Status_Comments__c,
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

    async function submit(formData) {
        // Modal save button state
        modalSaving();
        try {
            // Tags
            if (tagging) {
                await submitTagging(formData);
            }

            // Status
            if (status && !reflection) {
                await submitStatus(formData);
            }

            // Success Metrics
            if (metrics) {
                await submitMetrics(formData);
            }

            // Reflection
            if (reflection && !status) {
                await submitReflection(formData);
            }

            // Reflection and status (they write to the same object)
            if (reflection && status) {
                await submitReflectionAndStatus(formData);
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
    // DATA
    // ///////////////////

    // Current report details (reflections)
    const reportDetails = utilities.reportDetails.getFromReportId(REPORT_ID);

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
    // DATA - STATUS
    // ///////////////////

    // Get current status based on relationKey if any
    const currentStatus = status
        ? reportDetails.find(
              reportDetail =>
                  reportDetail[status.relationKey] === status.item.Id
          )
        : null;

    const currentStatusCount = [
        'Status__c',
        'Completion_Date__c',
        'Status_Comments__c',
    ].reduce((acc, key) => (acc = currentStatus?.[key] ? acc + 1 : acc), 0);

    // ///////////////////
    // DATA - METRICS
    // ///////////////////

    // Get current metrics
    const currentMetrics = utilities.activitySuccessMetrics.getFromActivityId(
        metrics.item?.Id
    );

    // ///////////////////
    // DATA - REFLECTION
    // ///////////////////

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
    const hasUpdate = [
        currentReflection?.Description__c,
        currentTags.length > 0,
        currentStatusCount > 0,
    ].some(x => x);

    // ///////////////////
    // FIELDS
    // ///////////////////

    const fields = [
        // Tagging
        ...(tagging
            ? taggingCollections.map(taggingCollection => ({
                  type: 'SelectList',
                  name: `taggingSelect-${taggingCollection.Tag__c}`,
                  label: `${label(`ReportUpdateModal${tagging.type}TagLabel`)}`,
                  subLabel: taggingCollection.Account_Name__c,
                  defaultValue: currentTags
                      .filter(
                          tag =>
                              tag.Tag__r?.Collection__c ===
                              taggingCollection.Tag__c
                      )
                      .map(tag => ({
                          selectValue: tag.Tag__r?.Id,
                      })),
                  listMaxLength: 3,
                  async options() {
                      // Get all tag options
                      const tagOptions = await ewGetAsync(
                          'tag/tag-collection',
                          {
                              id: taggingCollection.Tag__r?.Id,
                              type: tagging.type,
                          }
                      );

                      // Get default tags (no category)
                      const tagOptionsWithoutCategory = Object.values(
                          tagOptions?.data
                      ).filter(tag => !tag.Category__c);

                      // Get tags based on initiative category
                      const tagOptionsWithInitiativeCategory = Object.values(
                          tagOptions?.data
                      ).filter(
                          tag =>
                              tag.Category__c ===
                              utilities.initiative.get()?.Category__c
                      );

                      // Return both sets of tags
                      return [
                          ...tagOptionsWithoutCategory,
                          ...tagOptionsWithInitiativeCategory,
                      ].map(tag => ({
                          label: tag.Name,
                          value: tag.Id,
                      }));
                  },
              }))
            : []),

        // Status
        ...(status
            ? [
                  {
                      type: 'Select',
                      name: 'Status__c',
                      label: object.label(
                          'Initiative_Report_Detail__c.Status__c'
                      ),
                      subLabel: object.helpText(
                          'Initiative_Report_Detail__c.Status__c'
                      ),
                      defaultValue: currentStatus?.Status__c,
                      options: pickList(
                          'Initiative_Report_Detail__c.Status__c'
                      ),
                  },
                  {
                      type: 'DatePicker',
                      name: 'Completion_Date__c',
                      label: object.label(
                          'Initiative_Report_Detail__c.Completion_Date__c'
                      ),
                      subLabel: object.helpText(
                          'Initiative_Report_Detail__c.Completion_Date__c'
                      ),
                      defaultValue: currentStatus?.Completion_Date__c,
                  },
                  {
                      type: 'LongText',
                      name: 'Status_Comments__c',
                      label: object.label(
                          'Initiative_Report_Detail__c.Status_Comments__c'
                      ),
                      subLabel: object.helpText(
                          'Initiative_Report_Detail__c.Status_Comments__c'
                      ),
                      defaultValue: currentStatus?.Status_Comments__c,
                  },
              ]
            : []),

        // Metrics
        ...(metrics
            ? [
                  {
                      type: 'Metrics',
                      name: 'metricsList',
                      metrics: currentMetrics,
                      label: label('ReportUpdateModalMetricsLabel'),
                      defaultValue: currentMetrics.reduce(
                          (acc, metric) => ({
                              ...acc,
                              [metric.Id]: metric.Current_Status__c,
                          }),
                          {}
                      ),
                  },
              ]
            : []),

        // Reflection
        ...(reflection
            ? [
                  {
                      type: 'Reflection',
                      name: 'Description__c',
                      label: object.label(
                          'Initiative_Report_Detail__c.Description__c'
                      ),
                      subLabel: object.helpText(
                          'Initiative_Report_Detail__c.Description__c'
                      ),
                      defaultValue: currentReflection?.Description__c,
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
                        {/* Status */}
                        {currentStatusCount > 0 && (
                            <div className="flex items-center space-x-8">
                                <FiActivity className="w-24 h-24" />
                                <span className="relative top-2">
                                    {currentStatusCount}
                                </span>
                            </div>
                        )}
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
                        {currentReflection?.Description__c && (
                            <div className="flex items-center space-x-8">
                                <FiMessageCircle className="w-24 h-24" />
                                <span className="relative top-2">1</span>
                            </div>
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
                        // Reset form
                        mainForm.reset();
                        // Close modal
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
    metrics: t.shape({
        item: t.object.isRequired,
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
