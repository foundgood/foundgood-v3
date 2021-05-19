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
    DateRange,
} from 'components/_inputs';

const OverviewComponent = () => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo, valueSet, log } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control } = useForm();

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

    // Store: Wizard navigation
    const { setCurrentSubmitHandler } = useWizardNavigationStore();

    // Store: Initiative data
    const {
        CONSTANTS,
        initiative,
        isNovoLeadFunder,
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
                GrantDate,
            } = formData;

            await sfUpdate({
                object: 'Initiative__c',
                id: initiative.Id,
                data: {
                    Name,
                    Summary__c,
                    Category__c,
                    Grant_Start_Date__c: GrantDate.from,
                    Grant_End_Date__c: GrantDate.to,
                    Where_Is_Problem__c: Where_Is_Problem__c.map(
                        item => item.selectValue
                    ).join(';'),
                },
            });

            const collaboratorId = await sfCreate({
                object: 'Initiative_Collaborator__c',
                data: {
                    Type__c: CONSTANTS.TYPES.MAIN_COLLABORATOR,
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
            setCurrentSubmitHandler(handleSubmit(submit, error));
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
                    defaultValue={
                        Object.values(initiative?._collaborators).find(
                            item =>
                                item.Type__c ===
                                CONSTANTS.TYPES.MAIN_COLLABORATOR
                        )?.Account__c
                    }
                    label={labelTodo('Responsible organisation')}
                    placeholder={labelTodo('Grantee name')}
                    options={
                        accountGrantees?.records?.map(item => ({
                            label: item.Name,
                            value: item.Id,
                        })) ?? []
                    }
                    disabled={
                        Object.values(initiative?._collaborators).find(
                            item =>
                                item.Type__c ===
                                CONSTANTS.TYPES.MAIN_COLLABORATOR
                        )?.Account__c?.length > 0
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
                    disabled={isNovoLeadFunder()}
                    controller={control}
                />
                <Select
                    name="Category__c"
                    defaultValue={initiative?.Category__c}
                    label={labelTodo('Grant giving area')}
                    placeholder={labelTodo('Please select')}
                    options={valueSet('initiative.Category__c')}
                    controller={control}
                    disabled={initiative.Category__c || isNovoLeadFunder()}
                    required
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
                <DateRange
                    name="GrantDate"
                    label={labelTodo('Initiative period')}
                    defaultValue={{
                        from: initiative?.Grant_Start_Date__c,
                        to: initiative?.Grant_End_Date__c,
                    }}
                    controller={control}
                    disabled={isNovoLeadFunder()}
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
                    options={valueSet('account.Location__c')}
                    selectPlaceholder={labelTodo('Please select')}
                    selectLabel={labelTodo('Country')}
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
