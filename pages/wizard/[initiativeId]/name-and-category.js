// React
import React from 'react';

// Packages
import { useForm } from 'react-hook-form';

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

const nameAndCategoryComponent = () => {
    // ///////////////////
    // AUTH
    // ///////////////////

    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

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
            const { Name, Category__c } = formData;

            const { data: initiativeData } = await ewUpdate(
                'initiative/initiative',
                utilities.initiative.get().Id,
                {
                    Name,
                    Category__c,
                }
            );

            // Update initiative
            utilities.updateInitiative(initiativeData);
        } catch (error) {
            console.warn(error);
        }
    }

    useWizardSubmit({
        [CONTEXTS.CREATE_INITIATIVE]: [mainForm, submit],
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

nameAndCategoryComponent.propTypes = {};

nameAndCategoryComponent.defaultProps = {};

nameAndCategoryComponent.layout = 'wizard';

export default nameAndCategoryComponent;
