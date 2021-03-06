// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState, useWatch } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import { useElseware, useLabels, useModalState } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import WithPermission from 'components/withPermission';
import TitlePreamble from 'components/_wizard/titlePreamble';
import InputModal from 'components/_modals/wizardModal';
import PreLoader from 'components/preloader';
import { Select, LongText, Attach, InputWrapper } from 'components/_inputs';
import LogbookCard from 'components/_wizard/logbookCard';

const LogbookComponent = ({ pageProps }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label, object } = useLabels();
    const { ewCreateUpdateWrapper } = useElseware();
    const {
        modalState,
        modalOpen,
        modalClose,
        modalSaving,
        modalNotSaving,
    } = useModalState();

    // ///////////////////
    // STATE
    // ///////////////////

    const [updateId, setUpdateId] = useState(null);
    const [updateType, setUpdateType] = useState('text');
    const [attachLoading, setAttachLoading] = useState(false);

    // ///////////////////
    // FORMS
    // ///////////////////

    // Hook: useForm setup
    const mainForm = useForm();
    const attachImage = useWatch({
        control: mainForm.control,
        name: 'AttachImage',
    });
    const attachVideo = useWatch({
        control: mainForm.control,
        name: 'AttachVideo',
    });
    const attachDocument = useWatch({
        control: mainForm.control,
        name: 'AttachDocument',
    });

    // ///////////////////
    // METHODS
    // ///////////////////

    // Method: Adds founder to sf and updates founder list in view
    async function addEditItem(formData) {
        // Modal save button state
        modalSaving();
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
                { Initiative__c: utilities.initiative.get().Id },
                '_updates'
            );

            // Get update content
            const currentInitiativeUpdateContent = utilities.updateContents.getFromUpdateId(
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

    // Get activities
    const activities = utilities.activities.getAll();

    // Logbook entries
    const logbookEntries = utilities.updates
        .getTypeLogbookUpdate()
        .sort((a, b) => new Date(b.CreatedDate) - new Date(a.CreatedDate));

    // Get update content
    const currentInitiativeUpdateContent = utilities.updateContents.getFromUpdateId(
        updateId
    );

    // ///////////////////
    // EFFECTS
    // ///////////////////

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const {
            Description__c,
            Initiative_Activity__c,
        } = utilities.updates.get(updateId);

        // Check if there is content
        const content = utilities.updateContents.getFromUpdateId(updateId);

        // Update type
        setUpdateType(
            content?.Type__c ? content?.Type__c.toLowerCase() : 'text'
        );

        mainForm.setValue('Description__c', Description__c);
        mainForm.setValue('Initiative_Activity__c', Initiative_Activity__c);
    }, [updateId]);

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <WithPermission context>
            <TitlePreamble />
            <LogbookCard
                headline={label('MenuLogbook')}
                actionCreate={() => {
                    setUpdateId(null);
                    mainForm.reset();
                    modalOpen();
                }}
                actionUpdate={item => {
                    setUpdateId(null);
                    mainForm.reset();
                    modalOpen();
                    setUpdateId(item.Id);
                }}
                items={logbookEntries}
            />
            <InputModal
                {...{
                    form: mainForm,
                    onCancel() {
                        modalClose();
                    },
                    async onSave() {
                        await mainForm.handleSubmit(
                            async data => await addEditItem(data)
                        )();
                    },
                    title: label('ButtonAddLogEntry'),
                    ...modalState,
                }}>
                <InputWrapper>
                    <LongText
                        name="Description__c"
                        label={object.label(
                            'Initiative_Update__c.Description__c'
                        )}
                        subLabel={object.helpText(
                            'Initiative_Update__c.Description__c'
                        )}
                        required
                        controller={mainForm.control}
                    />
                    <div className="flex flex-col space-y-16">
                        <div className="flex space-x-16">
                            <Attach
                                name="AttachImage"
                                label={label('AttachImage')}
                                type="image"
                                accept=".png,.jpg,.jpeg"
                                controller={mainForm.control}
                                onClick={() => setUpdateType('picture')}
                                setAttachLoading={setAttachLoading}
                            />
                            <Attach
                                name="AttachVideo"
                                label={label('AttachVideo')}
                                type="video"
                                accept="video/mp4,video/x-m4v,video/*"
                                controller={mainForm.control}
                                onClick={() => setUpdateType('video')}
                                setAttachLoading={setAttachLoading}
                            />
                            <Attach
                                name="AttachDocument"
                                label={
                                    updateType === 'document' && !attachLoading
                                        ? label('OverwriteDocument')
                                        : label('AttachDocument')
                                }
                                type="document"
                                accept=".pdf"
                                controller={mainForm.control}
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
                                    {label('LogbookViewDocument')}
                                </a>
                            )}
                        </div>
                    </div>
                    <Select
                        name="Initiative_Activity__c"
                        label={object.label(
                            'Initiative_Update__c.Initiative_Activity__c'
                        )}
                        subLabel={object.helpText(
                            'Initiative_Update__c.Initiative_Activity__c'
                        )}
                        options={activities.map(activity => ({
                            value: activity.Id,
                            label: activity.Things_To_Do__c,
                        }))}
                        controller={mainForm.control}
                    />
                </InputWrapper>
            </InputModal>
        </WithPermission>
    );
};

LogbookComponent.propTypes = {};

LogbookComponent.defaultProps = {};

LogbookComponent.layout = 'wizard';

export default WithAuth(LogbookComponent);
