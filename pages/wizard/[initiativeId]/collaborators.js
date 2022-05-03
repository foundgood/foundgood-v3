// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import {
    useAuth,
    useLabels,
    useElseware,
    useContext,
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

const CollaboratorsComponent = ({ pageProps }) => {
    // ///////////////////
    // AUTH
    // ///////////////////

    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // ///////////////////
    // STORES
    // ///////////////////

    const { initiative, utilities, CONSTANTS } = useInitiativeDataStore();
    const { setCurrentSubmitHandler, currentItem } = useWizardNavigationStore();

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

    const { handleSubmit, control, setValue, reset } = useForm();
    const {
        handleSubmit: handleSubmitReflections,
        control: controlReflections,
        setValue: setValueReflections,
    } = useForm();
    const { isDirty } = useFormState({ control });

    // ///////////////////
    // METHODS
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

    // Get list of already selected collaborators so they can be removed from accountOrganisations records
    const alreadySelectedCollaborators = utilities.collaborators
        .getTypeAdditional()
        .map(collaborator => collaborator.Account__c);

    return (
        <>
            <TitlePreamble />
            <InputWrapper>
                {MODE === CONTEXTS.REPORT &&
                    Object.values(
                        initiative._collaborators
                    ).filter(collaborator =>
                        CONSTANTS.COLLABORATORS.ADDITIONAL_COLLABORATORS.includes(
                            collaborator.Type__c
                        )
                    ).length > 0 && (
                        <NoReflections
                            onClick={submitMultipleNoReflections}
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
                    return CONSTANTS.COLLABORATORS.ADDITIONAL_COLLABORATORS.includes(
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
                                'ReportWizardCollaboratorReflectionSubHeading'
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
                    {label('ButtonAddCollaborator')}
                </Button>
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={label('WizardModalHeadingCollaborators')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty || modalIsSaving}
                onSave={handleSubmit(submit)}>
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
                        controller={control}
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
                        options={valueSet(
                            'initiativeCollaborator.Type__c'
                        ).filter(item =>
                            CONSTANTS.COLLABORATORS.ADDITIONAL_COLLABORATORS.includes(
                                item.value
                            )
                        )}
                        required
                        controller={control}
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
                        controller={control}
                        required
                    />
                    <DateRange
                        name="Dates"
                        label={`${object.label(
                            'Initiative_Collaborator__c.Start_Date__c'
                        )} / ${object.label(
                            'Initiative_Collaborator__c.End_Date__c'
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
