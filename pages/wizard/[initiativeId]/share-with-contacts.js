// React
import React from 'react';

// Packages
import { useForm } from 'react-hook-form';

// Utilities
import { useContext, useElseware, useWizardSubmit } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import TitlePreamble from 'components/_wizard/titlePreamble';
import InviteContacts from 'components/_wizard/inviteContacts';

const ShareWithContactsComponent = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { CONTEXTS } = useContext();
    const { ewCreate, ewGet } = useElseware();

    // ///////////////////
    // FORMS
    // ///////////////////

    const mainForm = useForm();

    // ///////////////////
    // SUBMIT
    // ///////////////////

    useWizardSubmit({
        [CONTEXTS.CREATE_INITIATIVE]: [
            mainForm,
            async formData => {
                try {
                    const { contacts } = formData;

                    // Data for sf
                    const data = {
                        members: Object.values(contacts).map(contact => ({
                            Team_Member_Role__c: contact.type,
                            User__c: contact.Id,
                        })),
                        Initiative__c: utilities.initiative.get().Id,
                    };

                    // Create team members
                    await ewCreate('initiative-team-member/add-members', data);
                } catch (error) {
                    setError(true);
                    console.warn(error);
                }
            },
        ],
    });

    // ///////////////////
    // DATA
    // ///////////////////

    // Get organisations (initiative funders and collaborators)
    const organisations = [
        ...utilities.funders.getAll(),
        ...utilities.collaborators.getAll(),
    ];

    // Get contacts for funders and collaborators
    const { data: contacts } = ewGet(
        'account/account-users',
        {
            ids: organisations.map(organisation => organisation.Account__c),
        },
        organisations.length > 0
    );

    // ///////////////////
    // EFFECTS
    // ///////////////////

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <>
            <TitlePreamble />
            <InviteContacts
                {...{
                    organisations,
                    contacts,
                    form: mainForm,
                }}
            />
        </>
    );
};

ShareWithContactsComponent.propTypes = {};

ShareWithContactsComponent.defaultProps = {};

ShareWithContactsComponent.layout = 'wizard';

export default WithAuth(ShareWithContactsComponent);
