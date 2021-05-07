// React
import React, { useEffect } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';

// Utilities
import { useAuth, useMetadata, useSalesForce } from 'utilities/hooks';
import {
    useWizardNavigationStore,
    useInitiativeDataStore,
} from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import {
    InputWrapper,
    Select,
    Text,
    LongText,
    SelectList,
} from 'components/_inputs';

const OverviewComponent = () => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo, valueSet } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control } = useForm();

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

    // Store: Wizard navigation
    const { addSubmitHandler } = useWizardNavigationStore();

    // Store: Initiative data
    const {
        initiative,
        updateInitiative,
        updateCollaborator,
    } = useInitiativeDataStore();

    // Get data for form
    const { data: accountGrantees } = sfQuery(queries.account.allGrantees());

    // Method: Submit page content
    async function submit(formData) {
        try {
            const {
                Name,
                Summary__c,
                Where_Is_Problem__c,
                Account__c,
                Category__c,
            } = formData;

            await sfUpdate({
                object: 'Initiative__c',
                id: initiative.Id,
                data: {
                    Name,
                    Summary__c,
                    Category__c,
                    Where_Is_Problem__c: Where_Is_Problem__c.map(
                        item => item.selectValue
                    ).join(';'),
                },
            });

            const collaboratorId = await sfCreate({
                object: 'Initiative_Collaborator__c',
                data: {
                    Initiative__c: initiative.Id,
                    Account__c,
                },
            });

            await updateInitiative(initiative.Id);
            await updateCollaborator(collaboratorId);
        } catch (error) {
            console.warn(error);
        }
    }

    // Method: Form error/validation handler
    function error(error) {
        console.warn('Form invalid', error);
        throw error;
    }

    // Add submit handler to wizard navigation store
    useEffect(() => {
        setTimeout(() => {
            addSubmitHandler(handleSubmit(submit, error));
        }, 10);
    }, []);

    return (
        <>
            <TitlePreamble
                title={labelTodo('Overview')}
                preamble={labelTodo('Preamble')}
            />
            <InputWrapper>
                <Select
                    name="Account__c"
                    defaultValue={initiative?.Account__c}
                    label={labelTodo('Responsible organisation')}
                    placeholder={labelTodo('Grantee name')}
                    options={
                        accountGrantees?.records?.map(item => ({
                            label: item.Name,
                            value: item.Id,
                        })) ?? []
                    }
                    required
                    controller={control}
                />
                <Text
                    name="Name"
                    defaultValue={initiative?.Name?.replace('___', '')}
                    label={labelTodo('What is the name of your initiative?')}
                    placeholder={labelTodo('Title of initiative')}
                    maxLength={80}
                    required
                    controller={control}
                />
                <LongText
                    name="Summary__c"
                    defaultValue={initiative?.Summary__c}
                    label={labelTodo('What are your initiative about')}
                    placeholder={labelTodo(
                        "Brief description of initiative that details why it's important"
                    )}
                    maxLength={400}
                    controller={control}
                />
                <SelectList
                    name="Where_Is_Problem__c"
                    defaultValue={initiative?.Where_Is_Problem__c?.split(
                        ';'
                    ).map(value => ({
                        selectValue: value,
                    }))}
                    label={labelTodo('Where is it located?')}
                    listMaxLength={3}
                    options={valueSet('account.Location__c').map(item => ({
                        label: item.label,
                        value: item.fullName,
                    }))}
                    selectPlaceholder={labelTodo('Please select')}
                    selectLabel={labelTodo('Country')}
                    textLabel={labelTodo('Region')}
                    controller={control}
                />
                <Select
                    name="Category__c"
                    defaultValue={initiative?.Category__c}
                    label={labelTodo('Grant giving area')}
                    placeholder={labelTodo('Please select')}
                    options={valueSet('initiative.Category__c').map(item => ({
                        label: item.label,
                        value: item.fullName,
                    }))}
                    controller={control}
                />
            </InputWrapper>
        </>
    );
};

OverviewComponent.propTypes = {};

OverviewComponent.defaultProps = {};

OverviewComponent.layout = 'wizard';

export default OverviewComponent;
