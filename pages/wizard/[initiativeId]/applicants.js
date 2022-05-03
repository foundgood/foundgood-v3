// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState, useWatch } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import {
    useAuth,
    useContext,
    useElseware,
    useLabels,
    useReflections,
    useWizardSubmit,
} from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import Button from 'components/button';
import Modal from 'components/modal';
import { InputWrapper, Select, DateRange, LongText } from 'components/_inputs';
import CollaboratorCard from 'components/_wizard/collaboratorCard';
import NoReflections from 'components/_wizard/noReflections';

const ApplicantsComponent = ({ pageProps }) => {
    // ///////////////////
    // AUTH
    // ///////////////////

    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { MODE, CONTEXTS, REPORT_ID } = useContext();
    const { label, object, valueSet } = useLabels();
    const { ewGet, ewCreateUpdateWrapper } = useElseware();
    const {
        submitMultipleNoReflections,
        submitMultipleReflections,
    } = useReflections({
        dataSet() {
            return utilities.collaborators.getTypeApplicantsAll;
        },
        parentKey: 'Initiative_Collaborator__c',
        type: CONSTANTS.REPORT_DETAILS.COLLABORATOR_OVERVIEW,
    });

    // ///////////////////
    // STATE
    // ///////////////////

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsSaving, setModalIsSaving] = useState(false);
    const [reflecting, setReflecting] = useState(false);
    const [updateId, setUpdateId] = useState(null);
    const [applicantType, setApplicantType] = useState(null);

    // ///////////////////
    // FORMS
    // ///////////////////

    const mainForm = useForm();
    const reflectionForm = useForm();
    const { isDirty } = useFormState({ control: mainForm.control });
    const applicantTypeSelect = useWatch({
        control: mainForm.control,
        name: 'Type__c',
    });

    // ///////////////////
    // SUBMIT
    // ///////////////////

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
                { Initiative__c: utilities.initiative.get().Id },
                '_collaborators'
            );

            // Close modal
            setModalIsOpen(false);

            // Modal save button state
            setModalIsSaving(false);

            // Clear content in form
            mainForm.reset();

            // Fold out shit when done if report
            // setValue: reflectionForm.setValue,
            setTimeout(() => {
                if (MODE === CONTEXTS.REPORT) {
                    reflectionForm.setValue(
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

    useWizardSubmit({
        [CONTEXTS.REPORT]: [reflectionForm, submitMultipleReflections],
    });

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
    const reportDetailsItems = currentReportDetails.filter(item =>
        utilities.collaborators
            .getTypeApplicantsAll()
            .map(item => item.Id)
            .includes(item.Initiative_Collaborator__c)
    );

    // Get applicants
    const applicants = utilities.collaborators.getTypeApplicantsAll();

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

        mainForm.setValue('Type__c', Type__c);
        mainForm.setValue('Account__c', Account__c);
        mainForm.setValue('Dates', {
            from: Start_Date__c,
            to: End_Date__c,
        });
        mainForm.setValue('Description__c', Description__c);

        // Set goal type
        setApplicantType(Type__c);
    }, [updateId, modalIsOpen]);

    // Watch the change of goal type
    useEffect(() => {
        setApplicantType(applicantTypeSelect);
    }, [applicantTypeSelect]);

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <>
            <TitlePreamble />
            <InputWrapper>
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
                    const reflection = currentReportDetails.find(
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
                                MODE === CONTEXTS.REPORT &&
                                reflectionForm.control
                            }
                            name={collaborator.Id}
                            defaultValue={{
                                selected:
                                    reflection &&
                                    (reflection?.Description__c !==
                                        CONSTANTS.CUSTOM.NO_REFLECTIONS ??
                                        false),
                                value:
                                    reflection?.Description__c ===
                                    CONSTANTS.CUSTOM.NO_REFLECTIONS
                                        ? ''
                                        : reflection?.Description__c,
                            }}
                            inputLabel={label(
                                'ReportWizardCoApplicantReflectionSubHeading'
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
                    {label('ButtonAddApplicant')}
                </Button>
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={label('WizardModalHeadingApplicants')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty || modalIsSaving}
                onSave={mainForm.handleSubmit(submit)}>
                <InputWrapper>
                    <Select
                        name="Account__c"
                        label={object.label(
                            'Initiative_Collaborator__c.Account__c'
                        )}
                        subLabel={object.helpText(
                            'Initiative_Collaborator__c.Account__c'
                        )}
                        placeholder={label('FormCaptureSelectEmpty')}
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
                        controller={mainForm.control}
                    />
                    {/* Hide if main applicant */}
                    {utilities.collaborators.get(updateId)?.Type__c !==
                        CONSTANTS.COLLABORATORS.MAIN_COLLABORATOR && (
                        <Select
                            name="Type__c"
                            label={object.label(
                                'Initiative_Collaborator__c.Type__c'
                            )}
                            subLabel={object.helpText(
                                'Initiative_Collaborator__c.Type__c'
                            )}
                            placeholder={label('FormCaptureSelectEmpty')}
                            options={valueSet(
                                'initiativeCollaborator.Type__c'
                            ).filter(item =>
                                CONSTANTS.COLLABORATORS.APPLICANTS_CREATE.includes(
                                    item.value
                                )
                            )}
                            required
                            controller={mainForm.control}
                        />
                    )}
                    <LongText
                        name="Description__c"
                        label={object.label(
                            'Initiative_Collaborator__c.Description__c'
                        )}
                        subLabel={object.helpText(
                            'Initiative_Collaborator__c.Description__c'
                        )}
                        placeholder={label('FormCaptureTextEntryEmpty')}
                        controller={mainForm.control}
                    />
                    {applicantType ===
                        CONSTANTS.COLLABORATORS.MAIN_COLLABORATOR && (
                        <DateRange
                            name="Dates"
                            label={`${object.label(
                                'Initiative_Collaborator__c.Start_Date__c'
                            )} / ${object.label(
                                'Initiative_Collaborator__c.End_Date__c'
                            )}`}
                            controller={mainForm.control}
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
