// React
import React from 'react';

// Packages
import { useForm } from 'react-hook-form';

// Utilities
import {
    useContext,
    useElseware,
    useLabels,
    useWizardSubmit,
} from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import WithPermission from 'components/withPermission';
import TitlePreamble from 'components/_wizard/titlePreamble';
import { InputWrapper, FormFields } from 'components/_inputs';

const NameAndCategoryComponent = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { CONTEXTS } = useContext();
    const { object, pickList } = useLabels();
    const { ewUpdate } = useElseware();

    // ///////////////////
    // FORMS
    // ///////////////////

    // Hook: useForm setup
    const mainForm = useForm();

    // ///////////////////
    // SUBMIT
    // ///////////////////

    async function submit(formData) {
        try {
            const {
                Name,
                Category__c,
                Configuration_Type__c,
                GrantDate,
            } = formData;

            const { data: initiativeData } = await ewUpdate(
                'initiative/initiative',
                utilities.initiative.get().Id,
                {
                    Name,
                    Category__c,
                    Configuration_Type__c,
                    Grant_Start_Date__c: GrantDate.from,
                    Grant_End_Date__c: GrantDate.to,
                }
            );

            // Update initiative
            utilities.updateInitiative(initiativeData);
        } catch (error) {
            console.warn(error);
        }
    }

    useWizardSubmit({
        [CONTEXTS.CREATE]: [mainForm, submit],
    });

    // ///////////////////
    // FIELDS
    // ///////////////////

    const fields = [
        {
            type: 'Text',
            name: 'Name',
            label: object.label('Initiative__c.Name'),
            defaultValue:
                utilities.initiative.get().Name === '___'
                    ? ''
                    : utilities.initiative.get().Name,
            required: true,
            maxLength: 80,
        },
        {
            type: 'Select',
            name: 'Configuration_Type__c',
            label: object.label('Initiative__c.Configuration_Type__c'),
            subLabel: object.helpText('Initiative__c.Configuration_Type__c'),
            defaultValue: utilities.initiative.get().Configuration_Type__c,
            required: true,
            options: pickList('Initiative__c.Configuration_Type__c'),
        },
        {
            type: 'Select',
            name: 'Category__c',
            label: object.label('Initiative__c.Category__c'),
            subLabel: object.helpText('Initiative__c.Category__c'),
            defaultValue: utilities.initiative.get().Category__c,
            required: true,
            options: pickList('Initiative__c.Category__c'),
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
        },
    ];

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <WithPermission context>
            <TitlePreamble />
            <InputWrapper>
                <FormFields
                    {...{
                        fields,
                        form: mainForm,
                    }}
                />
            </InputWrapper>
        </WithPermission>
    );
};

NameAndCategoryComponent.propTypes = {};

NameAndCategoryComponent.defaultProps = {};

NameAndCategoryComponent.layout = 'wizard';

export default WithAuth(NameAndCategoryComponent);
