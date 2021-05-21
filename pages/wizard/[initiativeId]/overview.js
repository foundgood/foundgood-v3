// React
import React, { useState, useEffect } from 'react';

// Packages
import { useForm } from 'react-hook-form';

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
    const { labelTodo, label, valueSet, log, helpText } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control } = useForm();

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

    // Store: Wizard navigation
    const { setCurrentSubmitHandler, currentItem } = useWizardNavigationStore();

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

            // Only create collaborator if main collaborator have not been set
            if (!mainCollaborator?.Account__c || false) {
                const collaboratorId = await sfCreate({
                    object: 'Initiative_Collaborator__c',
                    data: {
                        Type__c: CONSTANTS.TYPES.MAIN_COLLABORATOR,
                        Initiative__c: initiative.Id,
                        Account__c,
                    },
                });
                await updateCollaborator(collaboratorId);
            }

            await updateInitiative(initiative.Id);
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

    // Main collaborator
    const mainCollaborator =
        Object.values(initiative?._collaborators).find(
            item => item.Type__c === CONSTANTS.TYPES.MAIN_COLLABORATOR
        ) || {};
    return (
        <>
            <TitlePreamble
                title={label(currentItem?.item?.labels?.form?.title)}
                preamble={label(currentItem?.item?.labels?.form?.preamble)}
            />
            {accountGrantees && (
                <InputWrapper>
                    <Select
                        name="Account__c"
                        defaultValue={mainCollaborator?.Account__c}
                        label={label('objects.initiative.Lead_Grantee__c')}
                        subLabel={helpText(
                            'objects.initiative.Lead_Grantee__c'
                        )}
                        placeholder={labelTodo('Grantee name')}
                        options={accountGrantees?.records?.map(item => ({
                            label: item.Name,
                            value: item.Id,
                        }))}
                        disabled={mainCollaborator?.Account__c ?? false}
                        required
                        controller={control}
                    />
                    <Text
                        name="Name"
                        defaultValue={initiative?.Name?.replace('___', '')}
                        label={label('custom.FA_InitiativeName')}
                        placeholder={labelTodo('TEXT_PLACEHOLDER')}
                        maxLength={80}
                        required
                        disabled={isNovoLeadFunder()}
                        controller={control}
                    />
                    <Select
                        name="Category__c"
                        defaultValue={initiative?.Category__c}
                        label={label('objects.initiative.Category__c')}
                        subLabel={helpText('objects.initiative.Category__c')}
                        placeholder={labelTodo('SELECT_PLACEHOLDER')}
                        options={valueSet('initiative.Category__c')}
                        controller={control}
                        disabled={initiative.Category__c || isNovoLeadFunder()}
                        required
                    />
                    <LongText
                        name="Summary__c"
                        defaultValue={initiative?.Summary__c}
                        label={label('objects.initiative.Summary__c')}
                        subLabel={helpText('objects.initiative.Summary__c')}
                        placeholder={labelTodo('TEXT_PLACEHOLDER')}
                        maxLength={400}
                        controller={control}
                    />
                    <DateRange
                        name="GrantDate"
                        label={labelTodo('Initiative period')}
                        label={`${label(
                            'objects.initiative.Grant_Start_Date__c'
                        )} / ${label('objects.initiative.Grant_End_Date__c')}`}
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
                        label={label('objects.initiative.Where_Is_Problem__c')}
                        subLabel={helpText(
                            'objects.initiative.Where_Is_Problem__c'
                        )}
                        listMaxLength={3}
                        options={valueSet('account.Location__c')}
                        selectPlaceholder={labelTodo('SELECT_PLACEHOLDER')}
                        controller={control}
                        buttonLabel={label('custom.FA_ButtonAddLocation')}
                    />
                </InputWrapper>
            )}
        </>
    );
};

OverviewComponent.propTypes = {};

OverviewComponent.defaultProps = {};

OverviewComponent.layout = 'wizard';

export default OverviewComponent;
