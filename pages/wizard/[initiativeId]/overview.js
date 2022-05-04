// React
import React from 'react';

// Packages
import { useForm, useWatch } from 'react-hook-form';

// Utilities
import {
    useAuth,
    useContext,
    useElseware,
    useLabels,
    useWizardSubmit,
} from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import { InputWrapper, FormFields } from 'components/_inputs';

const OverviewComponent = () => {
    // ///////////////////
    // AUTH
    // ///////////////////

    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { MODE, CONTEXTS } = useContext();
    const {
        label,
        object,
        dataSet,
        pickList,
        controlledPickList,
    } = useLabels();
    const { ewGet, ewCreate, ewUpdate, ewCreateUpdateWrapper } = useElseware();

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
    // SUBMIT
    // ///////////////////

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

            const { data: initiativeData } = await ewUpdate(
                'initiative/initiative',
                utilities.initiative.get().Id,
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
            utilities.updateInitiative(initiativeData);

            // Only create collaborator if main collaborator have not been set
            if (!mainCollaborator?.Account__c || false) {
                const { data: collaboratorData } = await ewCreate(
                    'initiative-collaborator/initiative-collaborator',
                    {
                        Type__c: CONSTANTS.COLLABORATORS.MAIN_COLLABORATOR,
                        Initiative__c: initiativeData.Id,
                        Account__c,
                    }
                );

                utilities.updateInitiativeData(
                    '_collaborators',
                    collaboratorData
                );
            }

            // Create / update funder objective based on Category
            await ewCreateUpdateWrapper(
                'initiative-goal/initiative-goal',
                funderObjective?.Id,
                {
                    Goal__c: Funder_Objective__c,
                    Type__c: CONSTANTS.GOALS.GOAL_PREDEFINED,
                    Funder_Objective__c,
                    KPI_Category__c: Category__c,
                },
                { Initiative__c: initiativeData.Id },
                '_goals'
            );
        } catch (error) {
            console.warn(error);
        }
    }

    useWizardSubmit({
        [CONTEXTS.INITIATIVE]: [mainForm, submit],
        [CONTEXTS.REPORT]: [mainForm, submit],
    });

    // ///////////////////
    // DATA
    // ///////////////////

    // Get data for form
    const { data: accountGrantees } = ewGet('account/account', {
        type: 'grantee',
    });

    // Main collaborator
    const mainCollaborator = utilities.collaborators.getTypeMain();

    // Funder objective (predefined goal)
    const funderObjective = utilities.goals.getTypePredefined();

    // ///////////////////
    // FIELDS
    // ///////////////////

    const fields = [
        {
            type: 'Select',
            name: 'Account__c',
            label: object.label('Initiative__c.Lead_Grantee__c'),
            defaultValue: accountGrantees
                ? Object.values(accountGrantees.data).find(
                      ag => ag.Id === mainCollaborator?.Account__c
                  )?.Id
                : null,
            disabled: mainCollaborator?.Id
                ? true
                : utilities.isNovoLeadFunder(),
            required: mainCollaborator?.Id ? false : true,
            // Type options
            subLabel: object.helpText('Initiative__c.Lead_Grantee__c'),
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
            label: object.label('Initiative__c.Name'),
            defaultValue:
                utilities.initiative.get().Name === '___'
                    ? ''
                    : utilities.initiative.get().Name,
            disabled:
                utilities.initiative.get().Name === '___'
                    ? utilities.isNovoLeadFunder()
                    : true,
            required:
                utilities.initiative.get().Name === '___'
                    ? !utilities.isNovoLeadFunder()
                    : false,
            // Type options
            maxLength: 80,
        },
        {
            type: 'Select',
            name: 'Category__c',
            label: object.label('Initiative__c.Category__c'),
            defaultValue: utilities.initiative.get().Category__c
                ? utilities.initiative.get().Category__c
                : '',
            disabled: utilities.isNovoLeadFunder(),
            required: true,
            // Type options
            options: pickList('Initiative__c.Category__c'),
            subLabel: object.helpText('Initiative__c.Category__c'),
        },
        {
            type: 'Select',
            name: 'Funder_Objective__c',
            label: object.label('Initiative_Goal__c.Funder_Objective__c'),
            defaultValue: funderObjective.Funder_Objective__c,
            disabled: !CategoryWatch && !utilities.initiative.get().Category__c,
            required: true,
            // Type options
            options: controlledPickList(
                'Initiative_Goal__c.Funder_Objective__c',
                CategoryWatch
                    ? CategoryWatch
                    : utilities.initiative.get().Category__c
            ),
            subLabel: object.helpText('Initiative_Goal__c.Funder_Objective__c'),
        },
        {
            type: 'LongText',
            name: 'Summary__c',
            label: object.label('Initiative__c.Summary__c'),
            defaultValue: utilities.initiative.get().Summary__c,
            required: true,
            // Type options
            maxLength: 400,
            subLabel: object.helpText('Initiative__c.Summary__c'),
        },
        {
            type: 'DateRange',
            name: 'GrantDate',
            label: `${object.label(
                'Initiative__c.Grant_Start_Date__c'
            )} / ${object.label('Initiative__c.Grant_End_Date__c')}`,
            defaultValue: {
                from: utilities.initiative.get().Grant_Start_Date__c,
                to: utilities.initiative.get().Grant_End_Date__c,
            },
            disabled: utilities.isNovoLeadFunder(),
        },
        {
            type: 'SelectList',
            name: 'Where_Is_Problem__c',
            label: object.label('Initiative__c.Where_Is_Problem__c'),
            defaultValue: utilities.initiative
                .get()
                .Where_Is_Problem__c?.split(';')
                .map(value => ({
                    selectValue: value,
                })),
            // Type options
            buttonLabel: label('ButtonAddLocation'),
            listMaxLength: 3,
            options: dataSet('Countries'),
            subLabel: object.helpText('Initiative__c.Where_Is_Problem__c'),
        },
        {
            type: 'SelectList',
            name: 'Problem_Effect__c',
            label: object.label('Initiative__c.Problem_Effect__c'),
            defaultValue: utilities.initiative
                .get()
                .Problem_Effect__c?.split(';')
                .map(value => ({
                    selectValue: value,
                })),
            // Type options
            buttonLabel: label('ButtonAddSDG'),
            listMaxLength: 10,
            options: pickList('Initiative__c.Problem_Effect__c'),
            subLabel: object.helpText('Initiative__c.Problem_Effect__c'),
        },
        ...(MODE === CONTEXTS.INITIATIVE
            ? [
                  {
                      type: 'Image',
                      name: 'Hero_Image__c',
                      label: object.label('Initiative__c.Hero_Image__c'),
                      defaultValue: utilities.initiative.get()
                          .Hero_Image_URL__c,
                      // Type options
                      subLabel: object.helpText('Initiative__c.Hero_Image__c'),
                  },
              ]
            : []),
    ];

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <>
            <TitlePreamble />
            <InputWrapper>
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
