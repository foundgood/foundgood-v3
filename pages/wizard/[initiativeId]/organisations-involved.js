// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState, useWatch } from 'react-hook-form';

// Utilities
import { useElseware, useLabels, useWizardSubmit } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import WithPermission from 'components/withPermission';
import Button from 'components/button';
import WizardModal from 'components/_modals/wizardModal';
import TitlePreamble from 'components/_wizard/titlePreamble';
import { InputWrapper, FormFields } from 'components/_inputs';
import OrganisationsList from 'components/_wizard/organisationsList';

const OrganisationsInvolvedComponent = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label, pickList } = useLabels();
    const { ewGet, ewDelete, ewCreateUpdateWrapper } = useElseware();

    // ///////////////////
    // STATE
    // ///////////////////

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsSaving, setModalIsSaving] = useState(false);
    const [updateId, setUpdateId] = useState(null);
    const [organisation, setOrganisation] = useState(null);
    const [organisationType, setOrganisationType] = useState(null);
    const [organisationValues, setOrganisationValues] = useState([]);
    const [typeValues, setTypeValues] = useState([]);

    // ///////////////////
    // FORMS
    // ///////////////////

    const mainForm = useForm();
    const { isDirty } = useFormState({ control: mainForm.control });
    const organisationTypeSelect = useWatch({
        control: mainForm.control,
        name: 'Role',
    });

    // ///////////////////
    // SUBMIT
    // ///////////////////

    async function submit(formData) {
        // Modal save button state
        setModalIsSaving(true);
        try {
            const { Account__c, Type__c } = formData;

            // Data for sf
            const data = {
                Account__c,
                Type__c,
            };

            // Add Funder or Collaborator
            if (organisationType === 'Initiative_Funder__c') {
                // Create/update funder
                await ewCreateUpdateWrapper(
                    'initiative-funder/initiative-funder',
                    updateId,
                    data,
                    { Initiative__c: utilities.initiative.get().Id },
                    '_funders'
                );
            }

            if (organisationType === 'Initiative_Collaborator__c') {
                // Create/update collaborator
                await ewCreateUpdateWrapper(
                    'initiative-collaborator/initiative-collaborator',
                    updateId,
                    data,
                    { Initiative__c: utilities.initiative.get().Id },
                    '_collaborators'
                );
            }

            // Close modal
            setModalIsOpen(false);

            // Modal save button state
            setModalIsSaving(false);

            // Clear content in form
            mainForm.reset();
        } catch (error) {
            // Modal save button state
            setModalIsSaving(false);
            console.warn(error);
        }
    }

    useWizardSubmit();

    // ///////////////////
    // METHODS
    // ///////////////////

    async function deleteOrganisation() {
        // Only delete if updateId
        setModalIsSaving(true);

        // Remove Funder or Collaborator
        if (organisationType === 'Initiative_Funder__c') {
            // Delete funder
            await ewDelete('initiative-funder/initiative-funder', updateId);

            // Update store
            utilities.removeInitiativeDataRelations(
                '_funders',
                item => item.Id === updateId
            );
        }

        if (organisationType === 'Initiative_Collaborator__c') {
            // Delete collaborator
            await ewDelete(
                'initiative-collaborator/initiative-collaborator',
                updateId
            );

            // Update store
            utilities.removeInitiativeDataRelations(
                '_collaborators',
                item => item.Id === updateId
            );
        }

        // Close modal
        setModalIsOpen(false);

        // Reset update id
        setUpdateId(null);

        // Modal save button state
        setModalIsSaving(false);

        // Clear content in form
        mainForm.reset();
    }

    // ///////////////////
    // DATA
    // ///////////////////

    // Get data for form
    const { data: accountFoundations } = ewGet('account/account', {
        type: 'foundation',
    });

    // Get data for form
    const { data: accountOrganisations } = ewGet('account/account', {
        type: 'organization',
    });

    // Get all funders
    const funders = utilities.funders.getAll();

    // Get all collaborators
    const collaborators = utilities.collaborators.getAll();

    // Get list of already selected funders so they can be removed from accountFoundations records
    const alreadySelectedFunders =
        funders?.map(funder => funder?.Account__c) ?? [];

    // Get list of already selected collaborators so they can be removed from accountOrganisations records
    const alreadySelectedCollaborators =
        collaborators?.map(collaborator => collaborator?.Account__c) ?? [];

    // ///////////////////
    // EFFECTS
    // ///////////////////

    useEffect(() => {
        setOrganisationType(organisationTypeSelect);
    }, [organisationTypeSelect]);

    useEffect(() => {
        mainForm.setValue('Role', organisationType);
        if (organisationType === 'Initiative_Funder__c') {
            const { Account__c, Type__c } = utilities.funders.get(updateId);
            mainForm.setValue('Account__c', Account__c);
            mainForm.setValue('Type__c', Type__c);
        }
        if (organisationType === 'Initiative_Collaborator__c') {
            const { Account__c, Type__c } = utilities.collaborators.get(
                updateId
            );
            mainForm.setValue('Account__c', Account__c);
            mainForm.setValue('Type__c', Type__c);
        }
    }, [updateId, modalIsOpen]);

    useEffect(() => {
        let values = [];
        if (
            organisationType === 'Initiative_Funder__c' &&
            accountFoundations?.data
        ) {
            values = Object.values(accountFoundations?.data).filter(item =>
                updateId ? true : !alreadySelectedFunders.includes(item.Id)
            );
        }
        if (
            organisationType === 'Initiative_Collaborator__c' &&
            accountOrganisations?.data
        ) {
            values = Object.values(accountOrganisations?.data).filter(item =>
                updateId
                    ? true
                    : !alreadySelectedCollaborators.includes(item.Id)
            );
        }
        setOrganisationValues(
            values.map(item => ({
                label: item.Name,
                value: item.Id,
            }))
        );
    }, [organisationType]);

    useEffect(() => {
        let values = [];
        if (organisationType === 'Initiative_Funder__c') {
            values = pickList('Initiative_Funder__c.Type__c');
        }
        if (organisationType === 'Initiative_Collaborator__c') {
            values = values = pickList('Initiative_Collaborator__c.Type__c');
        }
        setTypeValues(values);
    }, [organisationType]);

    // ///////////////////
    // FIELDS
    // ///////////////////

    const fields = [
        {
            type: 'Select',
            name: 'Role',
            label: label('WizardModalOrganisationsInvolvedRole'),
            required: true,
            // Type options
            options: pickList('Custom.WizardModalOrganisationsInvolvedRole'),
        },
        {
            type: 'Select',
            name: 'Type__c',
            label: label('WizardModalOrganisationsInvolvedOrganisationType'),
            required: true,
            // Type options
            options: typeValues,
        },
        {
            type: 'Select',
            name: 'Account__c',
            label: label('WizardModalOrganisationsInvolvedOrganisationName'),
            required: true,
            // Type options
            options: organisationValues,
        },
    ];

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <WithPermission context>
            <TitlePreamble />
            <InputWrapper>
                <Button
                    theme="teal"
                    className="self-start"
                    action={() => {
                        setUpdateId(null);
                        setModalIsOpen(true);
                    }}>
                    {label('ButtonAddOrganisationsInvolved')}
                </Button>
                <OrganisationsList
                    {...{
                        funders,
                        collaborators,
                        action(organisation, organisationType) {
                            setUpdateId(organisation.Id);
                            setOrganisationType(organisationType);
                            setModalIsOpen(true);
                        },
                    }}
                />
            </InputWrapper>
            <WizardModal
                {...{
                    isSaving: !isDirty || modalIsSaving,
                    isOpen: modalIsOpen,
                    onCancel() {
                        setModalIsOpen(false);
                    },
                    onSave: mainForm.handleSubmit(submit),
                    title: label('WizardModalHeadingOrganisationsInvolved'),
                }}>
                <InputWrapper>
                    <FormFields
                        {...{
                            fields,
                            form: mainForm,
                        }}
                    />
                </InputWrapper>
            </WizardModal>
        </WithPermission>
    );
};

OrganisationsInvolvedComponent.propTypes = {};

OrganisationsInvolvedComponent.defaultProps = {};

OrganisationsInvolvedComponent.layout = 'wizard';

export default WithAuth(OrganisationsInvolvedComponent);
