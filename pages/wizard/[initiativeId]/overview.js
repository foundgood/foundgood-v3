// React
import React, { useEffect } from 'react';

// Packages
import { useForm, useWatch } from 'react-hook-form';

// Utilities
import { useAuth, useMetadata, useElseware, useContext } from 'utilities/hooks';
import {
    useWizardNavigationStore,
    useInitiativeDataStore,
} from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import { InputWrapper, FormFields } from 'components/_inputs';

const OverviewComponent = () => {
    // ///////////////////
    // ///////////////////
    // AUTH
    // ///////////////////

    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // ///////////////////
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { MODE, CONTEXTS } = useContext();
    const { label, valueSet, controlledValueSet, helpText } = useMetadata();
    const { ewGet, ewCreate, ewUpdate, ewCreateUpdateWrapper } = useElseware();

    // ///////////////////
    // ///////////////////
    // STORES
    // ///////////////////

    const {
        CONSTANTS,
        initiative,
        isNovoLeadFunder,
        updateInitiative,
        updateInitiativeData,
    } = useInitiativeDataStore();

    // Store: Wizard navigation
    const { setCurrentSubmitHandler, currentItem } = useWizardNavigationStore();

    // ///////////////////
    // ///////////////////
    // FORMS
    // ///////////////////

    // Hook: useForm setup
    const mainForm = useForm();
    const CategoryWatch = useWatch({
        control: mainForm.control,
        name: 'Category__c',
    });

    // ///////////////////
    // ///////////////////
    // METHODS
    // ///////////////////

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
                Funder_Objective__c,
            } = formData;

            const initiativeData = await ewUpdate(
                'initiative/initiative',
                initiative.Id,
                {
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
                }
            );

            // Update initiative
            updateInitiative(initiativeData);

            // Only create collaborator if main collaborator have not been set
            if (!mainCollaborator?.Account__c || false) {
                const collaboratorData = await ewCreate(
                    'initiative-collaborator/initiative-collaborator',
                    {
                        Type__c: CONSTANTS.TYPES.MAIN_COLLABORATOR,
                        Initiative__c: initiative.Id,
                        Account__c,
                    }
                );

                updateInitiativeData('_collaborators', collaboratorData);
            }

            // Create / update funder objective based on Category
            await ewCreateUpdateWrapper(
                'initiative-goal/initiative-goal',
                funderObjective?.Id,
                {
                    Goal__c: Funder_Objective__c,
                    Type__c: CONSTANTS.TYPES.GOAL_PREDEFINED,
                    Funder_Objective__c,
                    KPI_Category__c: Category__c,
                },
                { Initiative__c: initiative.Id },
                '_goals'
            );
        } catch (error) {
            console.warn(error);
        }
    }

    // Method: Form error/validation handler
    function error(error) {
        console.warn('Form invalid', error);
        throw error;
    }

    // ///////////////////
    // ///////////////////
    // EFFECTS
    // ///////////////////

    // Add submit handler to wizard navigation store
    useEffect(() => {
        setTimeout(() => {
            setCurrentSubmitHandler(mainForm.handleSubmit(submit, error));
        }, 100);
    }, [initiative]);

    // ///////////////////
    // ///////////////////
    // DATA
    // ///////////////////

    // Get data for form
    const { data: accountGrantees } = ewGet('account/account', {
        type: 'grantee',
    });

    // Main collaborator
    const mainCollaborator =
        Object.values(initiative?._collaborators).find(
            item => item.Type__c === CONSTANTS.TYPES.MAIN_COLLABORATOR
        ) || {};

    // Funder objective
    const funderObjective =
        Object.values(initiative?._goals).find(
            item => item.Type__c === CONSTANTS.TYPES.GOAL_PREDEFINED
        ) || {};

    // ///////////////////
    // ///////////////////
    // FIELDS
    // ///////////////////

    const fields = [
        {
            type: 'Select',
            name: 'Account__c',
            label: label('objects.initiative.Lead_Grantee__c'),
            defaultValue: accountGrantees
                ? Object.values(accountGrantees.data).find(
                      ag => ag.Id === mainCollaborator?.Account__c
                  )?.Id
                : null,
            disabled: mainCollaborator?.Id ? true : isNovoLeadFunder(),
            required: mainCollaborator?.Id ? false : true,
            // Type options
            subLabel: helpText('objects.initiative.Lead_Grantee__c'),
            options: accountGrantees
                ? Object.values(accountGrantees.data).map(item => ({
                      label: item.Name,
                      value: item.Id,
                  }))
                : [],
        },
        {
            type: 'Text',
            name: 'Name',
            label: label('custom.FA_InitiativeName'),
            defaultValue: initiative?.Name === '___' ? '' : initiative?.Name,
            disabled: initiative?.Name === '___' ? isNovoLeadFunder() : true,
            required: initiative?.Name === '___' ? !isNovoLeadFunder() : false,
            // Type options
            maxLength: 80,
        },
        {
            type: 'Select',
            name: 'Category__c',
            label: label('objects.initiative.Category__c'),
            defaultValue: initiative?.Category__c ? initiative.Category__c : '',
            disabled: isNovoLeadFunder(),
            required: true,
            // Type options
            options: valueSet('initiative.Category__c'),
            subLabel: helpText('objects.initiative.Category__c'),
        },
        {
            type: 'Select',
            name: 'Funder_Objective__c',
            label: label('objects.initiativeGoal.Funder_Objective__c'),
            defaultValue: funderObjective.Funder_Objective__c,
            disabled: !CategoryWatch && !initiative?.Category__c,
            required: true,
            // Type options
            options: controlledValueSet(
                'initiativeGoal.Funder_Objective__c',
                CategoryWatch ? CategoryWatch : initiative?.Category__c
            ),
            subLabel: helpText('objects.initiativeGoal.Funder_Objective__c'),
        },
        {
            type: 'LongText',
            name: 'Summary__c',
            label: label('objects.initiative.Summary__c'),
            defaultValue: initiative?.Summary__c,
            required: true,
            // Type options
            maxLength: 400,
            subLabel: helpText('objects.initiative.Summary__c'),
        },
        {
            type: 'DateRange',
            name: 'GrantDate',
            label: `${label(
                'objects.initiative.Grant_Start_Date__c'
            )} / ${label('objects.initiative.Grant_End_Date__c')}`,
            defaultValue: {
                from: initiative?.Grant_Start_Date__c,
                to: initiative?.Grant_End_Date__c,
            },
            disabled: isNovoLeadFunder(),
        },
        {
            type: 'SelectList',
            name: 'Where_Is_Problem__c',
            label: label('objects.initiative.Where_Is_Problem__c'),
            defaultValue: initiative?.Where_Is_Problem__c?.split(';').map(
                value => ({
                    selectValue: value,
                })
            ),
            // Type options
            buttonLabel: label('custom.FA_ButtonAddLocation'),
            listMaxLength: 3,
            options: valueSet('account.Location__c'),
            subLabel: helpText('objects.initiative.Where_Is_Problem__c'),
        },
        {
            type: 'SelectList',
            name: 'Problem_Effect__c',
            label: label('objects.initiative.Problem_Effect__c'),
            defaultValue: initiative?.Problem_Effect__c?.split(';').map(
                value => ({
                    selectValue: value,
                })
            ),
            // Type options
            buttonLabel: label('custom.FA_ButtonAddSDG'),
            listMaxLength: 10,
            options: valueSet('initiative.Problem_Effect__c'),
            subLabel: helpText('objects.initiative.Problem_Effect__c'),
        },
        ...(MODE === CONTEXTS.INITIATIVE
            ? [
                  {
                      type: 'Image',
                      name: 'Hero_Image__c',
                      label: label('objects.initiative.Hero_Image__c'),
                      defaultValue: initiative?.Hero_Image_URL__c,
                      // Type options
                      subLabel: helpText('objects.initiative.Hero_Image__c'),
                  },
              ]
            : []),
    ];

    // ///////////////////
    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <>
            <TitlePreamble
                title={label(currentItem?.item?.labels?.form?.title)}
                preamble={label(currentItem?.item?.labels?.form?.preamble)}
                preload={!initiative.Id}
            />

            <InputWrapper preload={!initiative.Id}>
                <FormFields
                    {...{
                        fields,
                        form: mainForm,
                    }}
                />
            </InputWrapper>
        </>
    );
};

OverviewComponent.propTypes = {};

OverviewComponent.defaultProps = {};

OverviewComponent.layout = 'wizard';

export default OverviewComponent;
