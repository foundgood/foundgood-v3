// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState, useWatch } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import {
    useAuth,
    useMetadata,
    useContext,
    useElseware,
    useReflections,
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

const ApplicantsComponent = ({ pageProps }) => {
    // ///////////////////
    // ///////////////////
    // AUTH
    // ///////////////////

    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // ///////////////////
    // ///////////////////
    // STORES
    // ///////////////////

    const { initiative, utilities, CONSTANTS } = useInitiativeDataStore();
    const { setCurrentSubmitHandler, currentItem } = useWizardNavigationStore();

    // ///////////////////
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { MODE, CONTEXTS, REPORT_ID } = useContext();
    const { label, valueSet, helpText } = useMetadata();
    const { ewGet, ewCreateUpdateWrapper } = useElseware();
    const {
        submitMultipleNoReflections,
        submitMultipleReflections,
    } = useReflections({
        dataSet: utilities.collaborators.getTypeApplicantsAll,
        parentKey: 'Initiative_Collaborator__c',
        type: CONSTANTS.REPORT_DETAILS.COLLABORATOR_OVERVIEW,
    });

    // ///////////////////
    // ///////////////////
    // STATE
    // ///////////////////

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsSaving, setModalIsSaving] = useState(false);
    const [reflecting, setReflecting] = useState(false);
    const [updateId, setUpdateId] = useState(null);
    const [applicantType, setApplicantType] = useState(null);

    // ///////////////////
    // ///////////////////
    // FORMS
    // ///////////////////

    const { handleSubmit, control, setValue, reset } = useForm();
    const {
        handleSubmit: handleSubmitReflections,
        control: controlReflections,
        setValue: setValueReflections,
    } = useForm();
    const { isDirty } = useFormState({ control });
    const applicantTypeSelect = useWatch({ control, name: 'Type__c' });

    // ///////////////////
    // ///////////////////
    // METHODS
    // ///////////////////

    // Method: Adds founder to sf and updates founder list in view
    async function submit(formData) {
        try {
            // Modal save button state
            setModalIsSaving(true);

            const { Dates, Account__c, Type__c, Description__c } = formData;

            // Data for sf
            const data = {
                Account__c,
                Type__c,
                Description__c,
                Start_Date__c: Dates.from,
                End_Date__c: Dates.to,
            };

            // Update / Save
            const collaboratorData = await ewCreateUpdateWrapper(
                'initiative-collaborator/initiative-collaborator',
                updateId,
                data,
                { Initiative__c: initiative.Id },
                '_collaborators'
            );

            // Close modal
            setModalIsOpen(false);

            // Modal save button state
            setModalIsSaving(false);

            // Clear content in form
            reset();

            // Fold out shit when done if report
            // setValue: setValueReflections,
            setTimeout(() => {
                if (MODE === CONTEXTS.REPORT) {
                    setValueReflections(
                        `${collaboratorData.Id}-selector`,
                        true
                    );
                }
            }, 500);
        } catch (error) {
            // Modal save button state
            setModalIsSaving(false);
            console.warn(error);
        }
    }

    // Method: Form error/validation handler
    function error(error) {
        console.warn('Form invalid', error);
        throw error;
    }

    // ///////////////////
    // ///////////////////
    // EFFECTS
    // ///////////////////

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const {
            Start_Date__c,
            End_Date__c,
            Account__c,
            Type__c,
            Description__c,
        } = utilities.collaborators.get(updateId);

        setValue('Type__c', Type__c);
        setValue('Account__c', Account__c);
        setValue('Dates', {
            from: Start_Date__c,
            to: End_Date__c,
        });
        setValue('Description__c', Description__c);

        // Set goal type
        setApplicantType(Type__c);
    }, [updateId, modalIsOpen]);

    // Add submit handler to wizard navigation store
    useEffect(() => {
        setTimeout(() => {
            setCurrentSubmitHandler(
                MODE === CONTEXTS.REPORT
                    ? handleSubmitReflections(submitMultipleReflections, error)
                    : null
            );
        }, 100);
    }, [initiative]);

    // Watch the change of goal type
    useEffect(() => {
        setApplicantType(applicantTypeSelect);
    }, [applicantTypeSelect]);

    // ///////////////////
    // ///////////////////
    // DATA
    // ///////////////////

    // Get data for form
    const { data: accountGrantees } = ewGet('account/account', {
        type: 'grantee',
    });

    // Current report details
    const currentReportDetails = utilities.reportDetails.getFromReportId(
        REPORT_ID
    );

    // Check if there is relevant report details yet
    const reportDetailsItems = currentReportDetails
        .filter(item =>
            Object.keys(initiative?._collaborators).includes(
                item.Initiative_Collaborator__c
            )
        )
        .filter(item =>
            CONSTANTS.COLLABORATORS.APPLICANTS_ALL.includes(
                utilities.collaborators.get(item.Initiative_Collaborator__c)
                    .Type__c
            )
        );

    // Get applicants
    const applicants = utilities.collaborators.getTypeApplicantsAll();

    return (
        <>
            <TitlePreamble
                title={label(currentItem?.item?.labels?.form?.title)}
                preamble={label(currentItem?.item?.labels?.form?.preamble)}
                preload={!initiative.Id}
            />
            <InputWrapper preload={!initiative.Id}>
                {MODE === CONTEXTS.REPORT && applicants.length > 0 && (
                    <NoReflections
                        onClick={submitMultipleNoReflections}
                        reflectionItems={reportDetailsItems.map(
                            item => item.Description__c
                        )}
                        reflecting={reflecting}
                    />
                )}
                {applicants.map(collaborator => {
                    const reflection = currentReportDetails.filter(
                        item =>
                            item.Initiative_Collaborator__c === collaborator.Id
                    );
                    return (
                        <CollaboratorCard
                            key={collaborator.Id}
                            headline={
                                _get(collaborator, 'Account__r.Name') || ''
                            }
                            label={_get(collaborator, 'Type__c') || ''}
                            body={_get(collaborator, 'Description__c') || ''}
                            action={() => {
                                setUpdateId(collaborator.Id);
                                setModalIsOpen(true);
                            }}
                            reflectAction={setReflecting}
                            controller={
                                MODE === CONTEXTS.REPORT && controlReflections
                            }
                            name={collaborator.Id}
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
                                'custom.FA_ReportWizardCoApplicantReflectionSubHeading'
                            )}
                        />
                    );
                })}

                <Button
                    theme="teal"
                    className="self-start"
                    action={() => {
                        setUpdateId(null);
                        setModalIsOpen(true);
                    }}>
                    {label('custom.FA_ButtonAddApplicant')}
                </Button>
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={label('custom.FA_WizardModalHeadingApplicants')}
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
                            accountGrantees
                                ? Object.values(accountGrantees?.data).map(
                                      item => ({
                                          label: item.Name,
                                          value: item.Id,
                                      })
                                  )
                                : []
                        }
                        required
                        controller={control}
                    />
                    {/* Hide if main applicant */}
                    {initiative?._collaborators[updateId]?.Type__c !==
                        CONSTANTS.COLLABORATORS.MAIN_COLLABORATOR && (
                        <Select
                            name="Type__c"
                            label={label(
                                'objects.initiativeCollaborator.Type__c'
                            )}
                            subLabel={helpText(
                                'objects.initiativeCollaborator.Type__c'
                            )}
                            placeholder={label(
                                'custom.FA_FormCaptureSelectEmpty'
                            )}
                            options={valueSet(
                                'initiativeCollaborator.Type__c'
                            ).filter(item =>
                                CONSTANTS.COLLABORATORS.APPLICANTS_CREATE.includes(
                                    item.value
                                )
                            )}
                            required
                            controller={control}
                        />
                    )}
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
                    />
                    {applicantType ===
                        CONSTANTS.COLLABORATORS.MAIN_COLLABORATOR && (
                        <DateRange
                            name="Dates"
                            label={`${label(
                                'objects.initiativeCollaborator.Start_Date__c'
                            )} / ${label(
                                'objects.initiativeCollaborator.End_Date__c'
                            )}`}
                            controller={control}
                        />
                    )}
                </InputWrapper>
            </Modal>
        </>
    );
};

ApplicantsComponent.propTypes = {};

ApplicantsComponent.defaultProps = {};

ApplicantsComponent.layout = 'wizard';

export default ApplicantsComponent;
