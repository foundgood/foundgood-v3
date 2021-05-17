// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import { useAuth, useMetadata, useSalesForce } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import Button from 'components/button';
import Modal from 'components/modal';
import {
    InputWrapper,
    Select,
    SelectList,
    Text,
    DateRange,
    DatePicker,
    LongText,
} from 'components/_inputs';
import CollaboratorCard from 'components/_wizard/collaboratorCard';

const ApplicantsComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo, valueSet, log } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control, setValue, reset } = useForm();
    const { isDirty } = useFormState({ control });

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

    // Store: Initiative data
    const {
        initiative,
        updateCollaborator,
        CONSTANTS,
    } = useInitiativeDataStore();

    // Get data for form
    const { data: accountGrantees } = sfQuery(queries.account.allGrantees());

    // Method: Save new item, returns id
    async function save(object, data) {
        const id = await sfCreate({ object, data });
        return id;
    }

    // Method: Update current item, returns id
    async function update(object, data, id) {
        await sfUpdate({ object, data, id });
        return id;
    }

    // Method: Adds founder to sf and updates founder list in view
    async function submit(formData) {
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
                ? await update(object, data, updateId)
                : await save(object, { ...data, Initiative__c: initiative.Id });

            // Update store
            await updateCollaborator(collaboratorId);

            // Close modal
            setModalIsOpen(false);

            // Clear content in form
            reset();
        } catch (error) {
            console.warn(error);
        }
    }

    // Local state to handle modal
    const [modalIsOpen, setModalIsOpen] = useState(false);

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

    return (
        <>
            <TitlePreamble
                title={labelTodo('Who are the applicants of this initiative?')}
                preamble={labelTodo('Preamble')}
            />
            <InputWrapper>
                {Object.keys(initiative._collaborators).map(collaboratorKey => {
                    const collaborator =
                        initiative._collaborators[collaboratorKey];
                    return CONSTANTS.TYPES.APPLICANTS_ALL.includes(
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
                    {labelTodo('Add applicant')}
                </Button>
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={labelTodo('Add new applicant')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty}
                onSave={handleSubmit(submit)}>
                <InputWrapper>
                    <Select
                        name="Account__c"
                        label={labelTodo('Name of applicant')}
                        placeholder={labelTodo('Please select')}
                        options={
                            accountGrantees?.records?.map(item => ({
                                label: item.Name,
                                value: item.Id,
                            })) ?? []
                        }
                        required
                        controller={control}
                    />
                    {/* Hide if main applicant */}
                    {initiative?._collaborators[updateId]?.Type__c !==
                        CONSTANTS.TYPES.MAIN_COLLABORATOR && (
                        <Select
                            name="Type__c"
                            label={labelTodo('Type of applicant')}
                            placeholder={labelTodo('Please select')}
                            options={valueSet(
                                'initiativeCollaborator.Type__c'
                            ).filter(item =>
                                CONSTANTS.TYPES.APPLICANTS_CREATE.includes(
                                    item.value
                                )
                            )}
                            required
                            controller={control}
                        />
                    )}
                    <LongText
                        name="Description__c"
                        label={labelTodo('Description of collaboration')}
                        placeholder={labelTodo('Enter your description')}
                        controller={control}
                    />
                    <DateRange
                        name="Dates"
                        label={labelTodo('Collaboration period')}
                        controller={control}
                    />
                </InputWrapper>
            </Modal>
        </>
    );
};

ApplicantsComponent.propTypes = {};

ApplicantsComponent.defaultProps = {};

ApplicantsComponent.layout = 'wizard';

export default ApplicantsComponent;
