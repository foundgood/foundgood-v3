// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState, useWatch } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import { useAuth, useMetadata, useElseware } from 'utilities/hooks';
import {
    useInitiativeDataStore,
    useWizardNavigationStore,
} from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import Modal from 'components/modal';
import PreLoader from 'components/preloader';
import { InputWrapper, Select, LongText, Attach } from 'components/_inputs';
import LogbookCard from 'components/_wizard/logbookCard';

const LogbookComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { label, helpText } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control, setValue, reset } = useForm();
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

    // Hook: Elseware setup
    const { ewCreateUpdateWrapper } = useElseware();

    // Store: Initiative data
    const { initiative, utilities, CONSTANTS } = useInitiativeDataStore();

    // Store: Wizard navigation
    const { setCurrentSubmitHandler, currentItem } = useWizardNavigationStore();

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

            // Data for initiative update
            const data = {
                Description__c,
                Initiative_Activity__c,
            };

            // Update / Save
            const initiativeUpdate = await ewCreateUpdateWrapper(
                'initiative-update/initiative-update',
                updateId,
                data,
                { Initiative__c: initiative.Id },
                '_updates'
            );

            // Get update content
            const currentInitiativeUpdateContent = utilities.getInitiativeUpdateContent(
                initiativeUpdate?.Id
            );

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

            // Update if anything present
            if (updateUrl) {
                const contentData = {
                    Type__c: updateType,
                    Url__c: updateUrl,
                };

                // Update / Save
                // Add initiative_updatecontent with content data and update id
                await ewCreateUpdateWrapper(
                    'initiative-update-content/initiative-update-content',
                    currentInitiativeUpdateContent?.Id,
                    contentData,
                    { Initiative_Update__c: initiativeUpdate?.Id },
                    '_updateContents'
                );
            }

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

    // Local state to handle modal
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsSaving, setModalIsSaving] = useState(false);

    // We set an update id when updating and remove when adding
    const [updateId, setUpdateId] = useState(null);
    const [updateType, setUpdateType] = useState('text');

    // Local state to handle attach loading
    const [attachLoading, setAttachLoading] = useState(false);

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const { Description__c, Initiative_Activity__c } =
            initiative?._updates[updateId] ?? {};

        // Check if there is content
        const content = utilities.getInitiativeUpdateContent(updateId);

        // Update type
        setUpdateType(
            content?.Type__c ? content?.Type__c.toLowerCase() : 'text'
        );

        setValue('Description__c', Description__c);
        setValue('Initiative_Activity__c', Initiative_Activity__c);
    }, [updateId, modalIsOpen]);

    // Add submit handler to wizard navigation store
    useEffect(() => {
        setTimeout(() => {
            setCurrentSubmitHandler(null);
        }, 100);
    }, [initiative]);

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
    const logbookEntries = Object.values(initiative?._updates)
        .filter(update => update.Type__c === CONSTANTS.TYPES.LOGBOOK_UPDATE)
        .sort((a, b) => new Date(b.CreatedDate) - new Date(a.CreatedDate));

    // Get update content
    const currentInitiativeUpdateContent = utilities.getInitiativeUpdateContent(
        updateId
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
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={label('custom.FA_ButtonAddLogEntry')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty || modalIsSaving || attachLoading}
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
                                setAttachLoading={setAttachLoading}
                            />
                            <Attach
                                name="AttachVideo"
                                label={label('custom.FA_AttachVideo')}
                                type="video"
                                accept="video/mp4,video/x-m4v,video/*"
                                controller={control}
                                onClick={() => setUpdateType('video')}
                                setAttachLoading={setAttachLoading}
                            />
                            <Attach
                                name="AttachDocument"
                                label={label('custom.FA_AttachDocument')}
                                type="document"
                                accept=".pdf"
                                controller={control}
                                onClick={() => setUpdateType('document')}
                                setAttachLoading={setAttachLoading}
                            />
                        </div>
                        <div>
                            {attachLoading && <PreLoader />}
                            {updateType === 'picture' && !attachLoading && (
                                <img
                                    className="w-1/2 rounded-4"
                                    src={
                                        (typeof attachImage === 'string' &&
                                            attachImage) ||
                                        currentInitiativeUpdateContent.URL__c
                                    }
                                />
                            )}
                            {updateType === 'video' && !attachLoading && (
                                <video
                                    controls
                                    className="w-1/2 rounded-4"
                                    src={
                                        (typeof attachVideo === 'string' &&
                                            attachVideo) ||
                                        currentInitiativeUpdateContent.URL__c
                                    }
                                />
                            )}
                            {updateType === 'document' && !attachLoading && (
                                <a
                                    target="_blank"
                                    href={
                                        (typeof attachDocument === 'string' &&
                                            attachDocument) ||
                                        currentInitiativeUpdateContent.URL__c
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
