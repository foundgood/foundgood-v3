// React
import React, { useState, useEffect } from 'react';

// Packages
import { useForm } from 'react-hook-form';

// Utilities
import {
    useAuth,
    useMetadata,
    useSalesForce,
    useContext,
} from 'utilities/hooks';
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
    Image,
} from 'components/_inputs';

const OverviewComponent = () => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Context
    const { MODE, CONTEXTS } = useContext();

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
                Problem_Effect__c,
                Hero_Image__c,
            } = formData;

            await sfUpdate({
                object: 'Initiative__c',
                id: initiative.Id,
                data: {
                    Name,
                    Summary__c,
                    Category__c,
                    Hero_Image_URL__c: Hero_Image__c,
                    Grant_Start_Date__c: GrantDate.from,
                    Grant_End_Date__c: GrantDate.to,
                    Where_Is_Problem__c: Where_Is_Problem__c.map(
                        item => item.selectValue
                    ).join(';'),
                    Problem_Effect__c: Problem_Effect__c.map(
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
        }, 100);
    }, [initiative]);

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
                preload={!initiative.Id}
            />

            <InputWrapper preload={!initiative.Id}>
                {mainCollaborator.Id ? (
                    <>
                        <Text
                            name="Account__c"
                            defaultValue={
                                accountGrantees?.records.find(
                                    ag => ag.Id === mainCollaborator.Account__c
                                ).Name
                            }
                            label={label('objects.initiative.Lead_Grantee__c')}
                            subLabel={helpText(
                                'objects.initiative.Lead_Grantee__c'
                            )}
                            placeholder={label(
                                'custom.FA_FormCaptureSelectEmpty'
                            )}
                            disabled
                            controller={control}
                        />
                    </>
                ) : (
                    <Select
                        name="Account__c"
                        label={label('objects.initiative.Lead_Grantee__c')}
                        subLabel={helpText(
                            'objects.initiative.Lead_Grantee__c'
                        )}
                        placeholder={label('custom.FA_FormCaptureSelectEmpty')}
                        options={accountGrantees?.records.map(item => ({
                            label: item.Name,
                            value: item.Id,
                        }))}
                        disabled={isNovoLeadFunder()}
                        required
                        controller={control}
                    />
                )}
                {initiative?.Name === '___' ? (
                    <Text
                        name="Name"
                        label={label('custom.FA_InitiativeName')}
                        placeholder={label(
                            'custom.FA_FormCaptureTextEntryEmpty'
                        )}
                        maxLength={80}
                        required={!isNovoLeadFunder()}
                        disabled={isNovoLeadFunder()}
                        controller={control}
                    />
                ) : (
                    <Text
                        name="Name"
                        defaultValue={initiative?.Name}
                        label={label('custom.FA_InitiativeName')}
                        placeholder={label(
                            'custom.FA_FormCaptureTextEntryEmpty'
                        )}
                        maxLength={80}
                        disabled={true}
                        controller={control}
                    />
                )}

                {initiative?.Category__c ? (
                    <>
                        <Select
                            name="Category__c"
                            defaultValue={initiative.Category__c}
                            label={label('objects.initiative.Category__c')}
                            subLabel={helpText(
                                'objects.initiative.Category__c'
                            )}
                            placeholder={label(
                                'custom.FA_FormCaptureSelectEmpty'
                            )}
                            options={valueSet('initiative.Category__c')}
                            controller={control}
                            disabled={isNovoLeadFunder()}
                            required
                        />
                    </>
                ) : (
                    <Select
                        name="Category__c"
                        label={label('objects.initiative.Category__c')}
                        subLabel={helpText('objects.initiative.Category__c')}
                        placeholder={label('custom.FA_FormCaptureSelectEmpty')}
                        options={valueSet('initiative.Category__c')}
                        controller={control}
                        disabled={isNovoLeadFunder()}
                        required
                    />
                )}

                <LongText
                    name="Summary__c"
                    defaultValue={initiative?.Summary__c}
                    label={label('objects.initiative.Summary__c')}
                    subLabel={helpText('objects.initiative.Summary__c')}
                    placeholder={label('custom.FA_FormCaptureTextEntryEmpty')}
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
                    selectPlaceholder={label(
                        'custom.FA_FormCaptureSelectEmpty'
                    )}
                    controller={control}
                    buttonLabel={label('custom.FA_ButtonAddLocation')}
                />
                <SelectList
                    name="Problem_Effect__c"
                    defaultValue={initiative?.Problem_Effect__c?.split(';').map(
                        value => ({
                            selectValue: value,
                        })
                    )}
                    label={label('objects.initiative.Problem_Effect__c')}
                    subLabel={helpText('objects.initiative.Problem_Effect__c')}
                    listMaxLength={10}
                    options={valueSet('initiative.Problem_Effect__c')}
                    selectPlaceholder={label(
                        'custom.FA_FormCaptureSelectEmpty'
                    )}
                    controller={control}
                    buttonLabel={label('custom.FA_ButtonAddSDG')}
                />
                {MODE === CONTEXTS.INITIATIVE && (
                    <Image
                        name="Hero_Image__c"
                        label={label('objects.initiative.Hero_Image__c')}
                        subLabel={helpText('objects.initiative.Hero_Image__c')}
                        defaultValue={initiative.Hero_Image_URL__c}
                        controller={control}
                    />
                )}
            </InputWrapper>
        </>
    );
};

OverviewComponent.propTypes = {};

OverviewComponent.defaultProps = {};

OverviewComponent.layout = 'wizard';

export default OverviewComponent;
