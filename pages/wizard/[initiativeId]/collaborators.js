// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
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
import { InputWrapper, Select, DateRange, LongText } from 'components/_inputs';
import CollaboratorCard from 'components/_wizard/collaboratorCard';
import NoReflections from 'components/_wizard/noReflections';

const CollaboratorsComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Context for wizard pages
    const { MODE, CONTEXTS, UPDATE, REPORT_ID } = useContext();

    // Hook: Metadata
    const { labelTodo, label, valueSet, log, helpText } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control, setValue, reset } = useForm();
    const {
        handleSubmit: handleSubmitReflections,
        control: controlReflections,
    } = useForm();
    const { isDirty } = useFormState({ control });

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

    // Store: Initiative data
    const {
        initiative,
        getReportDetails,
        updateCollaborator,
        updateReportDetails,
        CONSTANTS,
    } = useInitiativeDataStore();

    // Store: Wizard navigation
    const { setCurrentSubmitHandler, currentItem } = useWizardNavigationStore();

    // Get data for form
    const { data: accountOrganisations } = sfQuery(
        queries.account.allOrganisations()
    );

    // Method: Adds founder to sf and updates founder list in view
    async function submit(formData) {
        // Modal save button state
        setModalIsSaving(true);

        try {
            const { Dates, Account__c, Type__c, Description__c } = formData;

            // Object name
            const object = 'Initiative_Collaborator__c';

            // Data for sf
            const data = {
                Account__c,
                Type__c,
                Description__c,
                Start_Date__c: Dates.from,
                End_Date__c: Dates.to,
            };

            // Update / Save
            const collaboratorId = updateId
                ? await sfUpdate({ object, data, id: updateId })
                : await sfCreate({
                      object,
                      data: { ...data, Initiative__c: initiative.Id },
                  });

            // Update store
            await updateCollaborator(collaboratorId);

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
        const reportDetails = Object.keys(initiative?._collaborators)
            .reduce((acc, key) => {
                // Does the reflection relation exist already?
                const currentReflection = currentReportDetails.filter(
                    item => item.Initiative_Collaborator__c === key
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
                              Type__c: CONSTANTS.TYPES.COLLABORATOR_OVERVIEW,
                              Initiative_Collaborator__c: item.relationId,
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
            Object.values(initiative?._collaborators)
                .filter(item =>
                    CONSTANTS.TYPES.COLLABORATORS.includes(item.Type__c)
                )
                .map(item =>
                    sfCreate({
                        object,
                        data: {
                            Type__c: CONSTANTS.TYPES.COLLABORATOR_OVERVIEW,
                            Initiative_Collaborator__c: item.Id,
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

    // Local state to handle reflection
    const [reflecting, setReflecting] = useState(false);

    // We set an update id when updating and remove when adding
    const [updateId, setUpdateId] = useState(null);

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const {
            Start_Date__c,
            End_Date__c,
            Account__c,
            Type__c,
            Description__c,
        } = initiative?._collaborators[updateId] ?? {};

        setValue('Type__c', Type__c);
        setValue('Account__c', Account__c);
        setValue('Dates', {
            from: Start_Date__c,
            to: End_Date__c,
        });
        setValue('Description__c', Description__c);
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

    // Current report details
    const currentReportDetails = getReportDetails(REPORT_ID);

    // Check if there is relevant report details yet
    const reportDetailsItems = currentReportDetails
        .filter(item =>
            Object.keys(initiative?._collaborators).includes(
                item.Initiative_Collaborator__c
            )
        )
        .filter(item => {
            // Collaborator
            const collaborator =
                initiative?._collaborators[item.Initiative_Collaborator__c];
            return CONSTANTS.TYPES.COLLABORATORS.includes(collaborator.Type__c);
        });

    return (
        <>
            <TitlePreamble
                title={label(currentItem?.item?.labels?.form?.title)}
                preamble={label(currentItem?.item?.labels?.form?.preamble)}
                preload={!initiative.Id}
            />
            <InputWrapper preload={!initiative.Id}>
                {MODE === CONTEXTS.REPORT && (
                    <NoReflections
                        onClick={submitNoReflections}
                        reflectionItems={reportDetailsItems.map(
                            item => item.Description__c
                        )}
                        reflecting={reflecting}
                    />
                )}
                {Object.keys(initiative._collaborators).map(collaboratorKey => {
                    const collaborator =
                        initiative._collaborators[collaboratorKey];
                    const reflection = currentReportDetails.filter(
                        item =>
                            item.Initiative_Collaborator__c === collaboratorKey
                    );
                    return CONSTANTS.TYPES.COLLABORATORS.includes(
                        collaborator.Type__c
                    ) ? (
                        <CollaboratorCard
                            key={collaboratorKey}
                            headline={
                                _get(collaborator, 'Account__r.Name') || ''
                            }
                            label={_get(collaborator, 'Type__c') || ''}
                            body={_get(collaborator, 'Description__c') || ''}
                            action={() => {
                                setUpdateId(collaboratorKey);
                                setModalIsOpen(true);
                            }}
                            reflectAction={setReflecting}
                            controller={
                                MODE === CONTEXTS.REPORT && controlReflections
                            }
                            name={collaboratorKey}
                            defaultValue={{
                                selected:
                                    reflection[0] &&
                                    (reflection[0]?.Description__c !==
                                        CONSTANTS.CUSTOM.NO_REFLECTIONS ??
                                        false),
                                value:
                                    reflection[0]?.Description__c ===
                                    CONSTANTS.CUSTOM.NO_REFLECTIONS
                                        ? ''
                                        : reflection[0]?.Description__c,
                            }}
                            inputLabel={label(
                                'custom.FA_ReportWizardCollaboratorReflectionSubHeading'
                            )}
                        />
                    ) : null;
                })}
                <Button
                    theme="teal"
                    className="self-start"
                    action={() => {
                        setUpdateId(null);
                        setModalIsOpen(true);
                    }}>
                    {label('custom.FA_ButtonAddCollaborator')}
                </Button>
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={label('custom.FA_WizardModalHeadingCollaborators')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty || modalIsSaving}
                onSave={handleSubmit(submit)}>
                <InputWrapper>
                    <Select
                        name="Account__c"
                        label={label(
                            'objects.initiativeCollaborator.Account__c'
                        )}
                        subLabel={helpText(
                            'objects.initiativeCollaborator.Account__c'
                        )}
                        placeholder={label('custom.FA_FormCaptureSelectEmpty')}
                        options={
                            accountOrganisations?.records?.map(item => ({
                                label: item.Name,
                                value: item.Id,
                            })) ?? []
                        }
                        required
                        controller={control}
                    />
                    <Select
                        name="Type__c"
                        label={label('objects.initiativeCollaborator.Type__c')}
                        subLabel={helpText(
                            'objects.initiativeCollaborator.Type__c'
                        )}
                        placeholder={label('custom.FA_FormCaptureSelectEmpty')}
                        options={valueSet(
                            'initiativeCollaborator.Type__c'
                        ).filter(item =>
                            CONSTANTS.TYPES.COLLABORATORS.includes(item.value)
                        )}
                        required
                        controller={control}
                    />
                    <LongText
                        name="Description__c"
                        label={label(
                            'objects.initiativeCollaborator.Description__c'
                        )}
                        subLabel={helpText(
                            'objects.initiativeCollaborator.Description__c'
                        )}
                        placeholder={label(
                            'custom.FA_FormCaptureTextEntryEmpty'
                        )}
                        controller={control}
                        required
                    />
                    <DateRange
                        name="Dates"
                        label={`${label(
                            'objects.initiativeCollaborator.Start_Date__c'
                        )} / ${label(
                            'objects.initiativeCollaborator.End_Date__c'
                        )}`}
                        controller={control}
                    />
                </InputWrapper>
            </Modal>
        </>
    );
};

CollaboratorsComponent.propTypes = {};

CollaboratorsComponent.defaultProps = {};

CollaboratorsComponent.layout = 'wizard';

export default CollaboratorsComponent;
