// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useWatch } from 'react-hook-form';

// Utilities
import { useElseware, useLabels, useModalState } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import WithPermission from 'components/withPermission';
import Button from 'components/button';
import InputModal from 'components/_modals/inputModal';
import DeleteModal from 'components/_modals/deleteModal';
import TitlePreamble from 'components/_wizard/titlePreamble';
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
    const {
        modalState,
        modalOpen,
        modalClose,
        modalSaving,
        modalNotSaving,
    } = useModalState();
    const {
        modalState: deleteModalState,
        modalOpen: deleteModalOpen,
        modalClose: deleteModalClose,
        modalSaving: deleteModalSaving,
        modalNotSaving: deleteModalNotSaving,
    } = useModalState();

    // ///////////////////
    // STATE
    // ///////////////////

    const [updateId, setUpdateId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [organisationType, setOrganisationType] = useState(null);
    const [organisationValues, setOrganisationValues] = useState([]);
    const [typeValues, setTypeValues] = useState([]);

    // ///////////////////
    // FORMS
    // ///////////////////

    const mainForm = useForm();
    const organisationTypeSelect = useWatch({
        control: mainForm.control,
        name: 'Role',
    });

    // ///////////////////
    // METHODS
    // ///////////////////

    async function addEditItem(formData) {
        // Modal save button state
        modalSaving();
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

    async function deleteItem() {
        deleteModalSaving();
        if (deleteId) {
            // Remove Funder or Collaborator
            if (organisationType === 'Initiative_Funder__c') {
                // Delete funder
                await ewDelete('initiative-funder/initiative-funder', deleteId);

                // Update store
                utilities.removeInitiativeDataRelations(
                    '_funders',
                    item => item.Id === deleteId
                );
            }

            if (organisationType === 'Initiative_Collaborator__c') {
                // Delete collaborator
                await ewDelete(
                    'initiative-collaborator/initiative-collaborator',
                    deleteId
                );

                // Update store
                utilities.removeInitiativeDataRelations(
                    '_collaborators',
                    item => item.Id === deleteId
                );
            }

            // Close modal
            deleteModalClose();

            // Reset update id
            setDeleteId(null);

            // Modal save button state
            deleteModalNotSaving();
        }
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

    // Get data for form
    const { data: accountGrantees } = ewGet('account/account', {
        type: 'grantee',
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
        // Get data depending on type Initiative_Funder__c or Initiative_Collaborator__c
        const dataGetter =
            organisationType === 'Initiative_Funder__c'
                ? utilities.funders.get
                : utilities.collaborators.get;
        const { Account__c, Type__c } = dataGetter(updateId);

        // Set values
        mainForm.setValue('Role', organisationType);
        mainForm.setValue('Account__c', Account__c);
        mainForm.setValue('Type__c', Type__c);
    }, [updateId]);

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
            accountOrganisations?.data &&
            accountGrantees?.data
        ) {
            values = [
                ...Object.values(accountOrganisations?.data),
                ...Object.values(accountGrantees?.data),
            ].filter(item =>
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
            values = pickList('Initiative_Collaborator__c.Type__c');
        }
        setTypeValues(values);
    }, [organisationType]);

    // ///////////////////
    // FIELDS
    // ///////////////////

    function fields() {
        return [
            {
                type: 'Select',
                name: 'Role',
                label: label('WizardModalOrganisationsInvolvedRole'),
                required: true,
                options: pickList(
                    'Custom.WizardModalOrganisationsInvolvedRole'
                ),
            },
            ...(organisationType
                ? [
                      {
                          type: 'Select',
                          name: 'Type__c',
                          label: label(
                              'WizardModalOrganisationsInvolvedOrganisationType'
                          ),
                          required: true,
                          options: typeValues,
                      },
                      {
                          type: 'Select',
                          name: 'Account__c',
                          label: label(
                              'WizardModalOrganisationsInvolvedOrganisationName'
                          ),
                          required: true,
                          options: organisationValues,
                      },
                  ]
                : []),
        ];
    }

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <WithPermission context>
            <TitlePreamble />
            <Button
                theme="teal"
                className="self-start mb-32"
                action={() => {
                    setUpdateId(null);
                    mainForm.reset();
                    modalOpen();
                }}>
                {label('ButtonAddOrganisationsInvolved')}
            </Button>
            <OrganisationsList
                {...{
                    funders,
                    collaborators,
                    methods: {
                        edit(organisation, organisationType) {
                            setUpdateId(organisation.Id);
                            setOrganisationType(organisationType);
                            modalOpen();
                        },
                        delete(organisation, organisationType) {
                            setDeleteId(organisation.Id);
                            setOrganisationType(organisationType);
                            deleteModalOpen();
                        },
                    },
                }}
            />
            <InputModal
                {...{
                    form: mainForm,
                    fields: fields(),
                    onCancel() {
                        setUpdateId(null);
                        mainForm.reset();
                        modalClose();
                    },
                    async onSave() {
                        await mainForm.handleSubmit(
                            async data => await addEditItem(data)
                        )();
                    },
                    title: label('WizardModalHeadingOrganisationsInvolved'),
                    ...modalState,
                }}
            />
            <DeleteModal
                {...{
                    onCancel() {
                        deleteModalClose();
                    },
                    async onDelete() {
                        await deleteItem();
                    },
                    title: label(
                        'WizardModalHeadingOrganisationsInvolvedDelete'
                    ),
                    text: label('WizardModalTextOrganisationsInvolvedDelete'),
                    ...deleteModalState,
                }}
            />
        </WithPermission>
    );
};

OrganisationsInvolvedComponent.propTypes = {};

OrganisationsInvolvedComponent.defaultProps = {};

OrganisationsInvolvedComponent.layout = 'wizard';

export default WithAuth(OrganisationsInvolvedComponent);
