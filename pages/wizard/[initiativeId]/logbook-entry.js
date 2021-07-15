// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState, useWatch } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import {
    useAuth,
    useMetadata,
    useSalesForce,
    useContext,
} from 'utilities/hooks';
import {
    useInitiativeDataStore,
    useWizardNavigationStore,
} from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import Button from 'components/button';
import Modal from 'components/modal';
import {
    InputWrapper,
    Select,
    LongText,
    Image,
    Attach,
} from 'components/_inputs';
import LogbookCard from 'components/_wizard/logbookCard';
import NoReflections from 'components/_wizard/noReflections';

const LogbookComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Context for wizard pages
    const { MODE, CONTEXTS, UPDATE, REPORT_ID } = useContext();

    // Hook: Metadata
    const { labelTodo, label, helpText, valueSet } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control, setValue, reset, getValues } = useForm();
    const attachImage = useWatch({
        control,
        name: 'AttachImage',
    });
    const attachVideo = useWatch({
        control,
        name: 'AttachVideo',
    });
    const attachDocument = useWatch({
        control,
        name: 'AttachDocument',
    });
    const { isDirty } = useFormState({ control });
    const {
        handleSubmit: handleSubmitReflections,
        control: controlReflections,
    } = useForm();

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

    // Store: Initiative data
    const {
        initiative,
        getReportDetails,
        updateInitiativeUpdate,
        updateReportDetails,
        isNovoLeadFunder,
        CONSTANTS,
    } = useInitiativeDataStore();

    // Store: Wizard navigation
    const { setCurrentSubmitHandler, currentItem } = useWizardNavigationStore();

    // Get data for form
    const { data: accountFoundations } = sfQuery(
        queries.account.allFoundations()
    );

    // Method: Adds founder to sf and updates founder list in view
    async function submit(formData) {
        // Modal save button state
        setModalIsSaving(true);
        try {
            const {
                Description__c,
                Initiative_Activity__c,
                AttachImage,
                AttachVideo,
                AttachDocument,
            } = formData;

            // Object name
            const object = 'Initiative_Update__c';

            // Data for initiative update
            const data = {
                Description__c,
                Initiative_Activity__c,
            };

            // Update / Save
            const initiativeUpdateId = updateId
                ? await sfUpdate({ object, data, id: updateId })
                : await sfCreate({
                      object,
                      data: { ...data, Initiative__c: initiative.Id },
                  });

            // Update store
            await updateInitiativeUpdate(initiativeUpdateId);

            // Get initiativeUpdate in question to see if there is any content
            const currentInitiativeUpdate =
                initiative?._initiativeUpdates[initiativeUpdateId];

            // Data for content update
            let updateUrl;
            switch (updateType) {
                case 'picture':
                    updateUrl = AttachImage;
                    break;
                case 'video':
                    updateUrl = AttachVideo;
                    break;
                case 'document':
                    updateUrl = AttachDocument;
                    break;
            }
            const contentData = {
                Type__c: updateType,
                Url__c: updateUrl,
            };

            // Add initiative_updatecontent with content data and update id
            const initiativeContentUpdateId = currentInitiativeUpdate
                ?.Initiative_Update_Content__r?.records[0].Id
                ? await sfUpdate({
                      object: 'Initiative_Update_Content__c',
                      data: contentData,
                      id:
                          currentInitiativeUpdate?.Initiative_Update_Content__r
                              ?.records[0].Id,
                  })
                : await sfCreate({
                      object: 'Initiative_Update_Content__c',
                      data: {
                          ...contentData,
                          Initiative_Update__c: initiativeUpdateId,
                      },
                  });

            // Update store
            await updateInitiativeUpdate(initiativeUpdateId);

            // Close modal
            setModalIsOpen(false);

            // Modal save button state
            setModalIsSaving(false);

            // Clear content in form
            reset();
        } catch (error) {
            // Modal save button state
            setModalIsSaving(false);
            console.warn(error);
        }
    }

    // Method: Adds reflections
    async function submitReflections(formData) {
        // Reformat form data based on topic keys
        const reportDetails = Object.keys(initiative?._funders)
            .reduce((acc, key) => {
                // Does the reflection relation exist already?
                const currentReflection = currentReportDetails.filter(
                    item => item.Initiative_Funder__c === key
                );
                return [
                    ...acc,
                    {
                        reportDetailId: currentReflection[0]?.Id ?? false,
                        relationId: key,
                        value: formData[`${key}-reflection`],
                        selected: formData[`${key}-selector`],
                    },
                ];
            }, [])
            .filter(item => item.selected);

        // Object name
        const object = 'Initiative_Report_Detail__c';

        // Create or update report detail ids based on reformatted form data
        // Update if reportDetailId exist in item - this means we have it already in the store
        const reportDetailIds = await Promise.all(
            reportDetails.map(item =>
                item.reportDetailId
                    ? sfUpdate({
                          object,
                          id: item.reportDetailId,
                          data: {
                              Description__c: item.value,
                          },
                      })
                    : sfCreate({
                          object,
                          data: {
                              Type__c: CONSTANTS.TYPES.FUNDER_OVERVIEW,
                              Initiative_Funder__c: item.relationId,
                              Description__c: item.value,
                              Initiative_Report__c: REPORT_ID,
                          },
                      })
            )
        );

        // Bulk update affected activity goals
        await updateReportDetails(reportDetailIds);
    }

    // Method: Submits no reflections flag
    async function submitNoReflections() {
        // Object name
        const object = 'Initiative_Report_Detail__c';

        // Create or update report detail ids based on reformatted form data
        // Update if reportDetailId exist in item - this means we have it already in the store
        const reportDetailIds = await Promise.all(
            Object.keys(initiative?._funders).map(funderKey =>
                sfCreate({
                    object,
                    data: {
                        Type__c: CONSTANTS.TYPES.FUNDER_OVERVIEW,
                        Initiative_Funder__c: funderKey,
                        Description__c: CONSTANTS.CUSTOM.NO_REFLECTIONS,
                        Initiative_Report__c: REPORT_ID,
                    },
                })
            )
        );

        // Bulk update affected activity goals
        await updateReportDetails(reportDetailIds);
    }

    // Method: Form error/validation handler
    function error(error) {
        console.warn('Form invalid', error);
        throw error;
    }

    // Local state to handle modal
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsSaving, setModalIsSaving] = useState(false);

    // We set an update id when updating and remove when adding
    const [updateId, setUpdateId] = useState(null);
    const [updateType, setUpdateType] = useState(null);

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const {
            Description__c,
            Initiative_Activity__c,
            Initiative_Update_Content__r,
        } = initiative?._initiativeUpdates[updateId] ?? {};

        // Check if there is content
        const content = Initiative_Update_Content__r?.records[0];

        // Update type
        setUpdateType(content?.Type__c.toLowerCase());

        setValue('Description__c', Description__c);
        setValue('Initiative_Activity__c', Initiative_Activity__c);
    }, [updateId, modalIsOpen]);

    // Add submit handler to wizard navigation store
    useEffect(() => {
        if (MODE === CONTEXTS.REPORT) {
            setTimeout(() => {
                setCurrentSubmitHandler(
                    handleSubmitReflections(submitReflections, error)
                );
            }, 100);
        } else {
            setTimeout(() => {
                setCurrentSubmitHandler(null);
            }, 100);
        }
    }, [initiative]);

    // TODO Current report details
    const currentReportDetails = getReportDetails(REPORT_ID);

    // TODO Check if there is relevant report details yet
    const reportDetailsItems = currentReportDetails.filter(item =>
        Object.keys(initiative?._funders).includes(item.Initiative_Funder__c)
    );

    // Activities
    const activities = Object.values(initiative?._activities).filter(
        activity => {
            return (
                activity.Activity_Type__c ===
                CONSTANTS.TYPES.ACTIVITY_INTERVENTION
            );
        }
    );

    // Logbook entries
    const logbookEntries = Object.values(initiative?._initiativeUpdates).filter(
        update => update.Type__c === CONSTANTS.TYPES.LOGBOOK_UPDATE
    );

    return (
        <>
            <TitlePreamble
                title={label(currentItem?.item?.labels?.form?.title)}
                preamble={label(currentItem?.item?.labels?.form?.preamble)}
                preload={!initiative.Id}
            />
            <InputWrapper preload={!initiative.Id}>
                <LogbookCard
                    headline={label('custom.FA_MenuLogbook')}
                    actionCreate={() => {
                        setUpdateId(null);
                        setModalIsOpen(true);
                    }}
                    actionUpdate={item => {
                        setModalIsOpen(true);
                        setUpdateId(item.Id);
                    }}
                    items={logbookEntries}
                />

                {/* TODO: NO reflections? */}
                {MODE === CONTEXTS.REPORT && (
                    <NoReflections
                        onClick={submitNoReflections}
                        show={
                            reportDetailsItems.filter(
                                item =>
                                    item.Description__c !==
                                    CONSTANTS.CUSTOM.NO_REFLECTIONS
                            ).length < 1
                        }
                        submitted={
                            reportDetailsItems.filter(
                                item =>
                                    item.Description__c ===
                                    CONSTANTS.CUSTOM.NO_REFLECTIONS
                            ).length > 0
                        }
                    />
                )}
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={label('custom.FA_ButtonAddLogEntry')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty || modalIsSaving}
                onSave={handleSubmit(submit)}>
                <InputWrapper>
                    <LongText
                        name="Description__c"
                        label={label('objects.initiativeUpdate.Description__c')}
                        subLabel={helpText(
                            'objects.initiativeUpdate.Description__c'
                        )}
                        placeholder={label(
                            'custom.FA_FormCaptureTextEntryEmpty'
                        )}
                        required
                        controller={control}
                    />
                    <div className="flex flex-col space-y-16">
                        <div className="flex space-x-16">
                            <Attach
                                name="AttachImage"
                                label={label('custom.FA_AttachImage')}
                                type="image"
                                accept=".png,.jpg,.jpeg"
                                controller={control}
                                onClick={() => setUpdateType('picture')}
                            />
                            <Attach
                                name="AttachVideo"
                                label={label('custom.FA_AttachVideo')}
                                type="video"
                                accept="video/mp4,video/x-m4v,video/*"
                                controller={control}
                                onClick={() => setUpdateType('video')}
                            />
                            <Attach
                                name="AttachDocument"
                                label={label('custom.FA_AttachDocument')}
                                type="document"
                                accept=".pdf"
                                controller={control}
                                onClick={() => setUpdateType('document')}
                            />
                        </div>
                        <div>
                            {updateType === 'picture' && (
                                <img
                                    className="w-1/2 rounded-4"
                                    src={
                                        (typeof attachImage === 'string' &&
                                            attachImage) ||
                                        initiative?._initiativeUpdates[updateId]
                                            ?.Initiative_Update_Content__r
                                            ?.records[0].URL__c
                                    }
                                />
                            )}
                            {updateType === 'video' && (
                                <video
                                    controls
                                    className="w-1/2 rounded-4"
                                    src={
                                        (typeof attachVideo === 'string' &&
                                            attachVideo) ||
                                        initiative?._initiativeUpdates[updateId]
                                            ?.Initiative_Update_Content__r
                                            ?.records[0].URL__c
                                    }
                                />
                            )}
                            {updateType === 'document' && (
                                <a
                                    target="_blank"
                                    href={
                                        (typeof attachDocument === 'string' &&
                                            attachDocument) ||
                                        initiative?._initiativeUpdates[updateId]
                                            ?.Initiative_Update_Content__r
                                            ?.records[0].URL__c
                                    }>
                                    View document
                                </a>
                            )}
                        </div>
                    </div>
                    <Select
                        name="Initiative_Activity__c"
                        label={label(
                            'objects.initiativeUpdate.Initiative_Activity__c'
                        )}
                        subLabel={helpText(
                            'objects.initiativeUpdate.Initiative_Activity__c'
                        )}
                        placeholder={label('custom.FA_FormCaptureSelectEmpty')}
                        options={activities.map(activity => ({
                            value: activity.Id,
                            label: activity.Things_To_Do__c,
                        }))}
                        controller={control}
                    />
                </InputWrapper>
            </Modal>
        </>
    );
};

LogbookComponent.propTypes = {};

LogbookComponent.defaultProps = {};

LogbookComponent.layout = 'wizard';

export default LogbookComponent;
