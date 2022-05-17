// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import {
    useContext,
    useElseware,
    useLabels,
    useReflections,
    useWizardSubmit,
} from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import TitlePreamble from 'components/_wizard/titlePreamble';
import Button from 'components/button';
import WizardModal from 'components/wizardModal';
import { InputWrapper, Select, DateRange, LongText } from 'components/_inputs';
import CollaboratorCard from 'components/_wizard/collaboratorCard';
import NoReflections from 'components/_wizard/noReflections';

const CollaboratorsComponent = ({ pageProps }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { MODE, CONTEXTS, REPORT_ID } = useContext();
    const { label, object, pickList } = useLabels();
    const { ewGet, ewCreateUpdateWrapper } = useElseware();
    const {
        submitMultipleNoReflections,
        submitMultipleReflections,
        getReflectionDefaultValue,
    } = useReflections({
        dataSet() {
            return utilities.collaborators.getTypeAdditional;
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

    // ///////////////////
    // FORMS
    // ///////////////////

    const mainForm = useForm();
    const reflectionForm = useForm();
    const { isDirty } = useFormState({ control: mainForm.control });

    // ///////////////////
    // SUBMIT
    // ///////////////////

    // Method: Adds founder to sf and updates founder list in view
    async function submit(formData) {
        // Modal save button state
        setModalIsSaving(true);

        try {
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
    const { data: accountOrganisations } = ewGet('account/account', {
        type: 'organization',
    });

    // Current report details
    const currentReportDetails = utilities.reportDetails.getFromReportId(
        REPORT_ID
    );

    // Check if there is relevant report details yet
    const reportDetailsItems = currentReportDetails.filter(item =>
        utilities.collaborators
            .getTypeAdditional()
            .map(item => item.Id)
            .includes(item.Initiative_Collaborator__c)
    );

    // Get all collaborators (additionaæ)
    const collaborators = utilities.collaborators.getTypeAdditional();

    // Get list of already selected collaborators so they can be removed from accountOrganisations records
    const alreadySelectedCollaborators = collaborators.map(
        collaborator => collaborator.Account__c
    );

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
    }, [updateId, modalIsOpen]);

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <>
            <TitlePreamble />
            <InputWrapper>
                <Button
                    theme="teal"
                    className="self-start"
                    action={() => {
                        setUpdateId(null);
                        setModalIsOpen(true);
                    }}>
                    {label('ButtonAddCollaborator')}
                </Button>
                {MODE === CONTEXTS.REPORT && collaborators.length > 0 && (
                    <NoReflections
                        onClick={submitMultipleNoReflections}
                        reflectionItems={reportDetailsItems.map(
                            item => item.Description__c
                        )}
                        reflecting={reflecting}
                    />
                )}
                {collaborators.map(collaborator => {
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
                                MODE === CONTEXTS.REPORT &&
                                reflectionForm.control
                            }
                            name={collaborator.Id}
                            defaultValue={getReflectionDefaultValue(reflection)}
                            inputLabel={label(
                                'ReportWizardCollaboratorReflectionSubHeading'
                            )}
                        />
                    );
                })}
            </InputWrapper>
            <WizardModal
                isOpen={modalIsOpen}
                title={label('WizardModalHeadingCollaborators')}
                onCancel={() => setModalIsOpen(false)}
                isSaving={!isDirty || modalIsSaving}
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
                            accountOrganisations
                                ? Object.values(accountOrganisations?.data)
                                      .map(item => ({
                                          label: item.Name,
                                          value: item.Id,
                                      }))
                                      .filter(item =>
                                          updateId
                                              ? true
                                              : !alreadySelectedCollaborators.includes(
                                                    item.value
                                                )
                                      )
                                : []
                        }
                        required
                        controller={mainForm.control}
                    />
                    <Select
                        name="Type__c"
                        label={object.label(
                            'Initiative_Collaborator__c.Type__c'
                        )}
                        subLabel={object.helpText(
                            'Initiative_Collaborator__c.Type__c'
                        )}
                        placeholder={label('FormCaptureSelectEmpty')}
                        options={pickList(
                            'Initiative_Collaborator__c.Type__c'
                        ).filter(item =>
                            CONSTANTS.COLLABORATORS.ADDITIONAL_COLLABORATORS.includes(
                                item.value
                            )
                        )}
                        required
                        controller={mainForm.control}
                    />
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
                        required
                    />
                    <DateRange
                        name="Dates"
                        label={`${object.label(
                            'Initiative_Collaborator__c.Start_Date__c'
                        )} / ${object.label(
                            'Initiative_Collaborator__c.End_Date__c'
                        )}`}
                        controller={mainForm.control}
                    />
                </InputWrapper>
            </WizardModal>
        </>
    );
};

CollaboratorsComponent.propTypes = {};

CollaboratorsComponent.defaultProps = {};

CollaboratorsComponent.layout = 'wizard';

export default WithAuth(CollaboratorsComponent);
