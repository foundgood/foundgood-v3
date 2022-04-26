// React
import React, { useEffect } from 'react';

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
import { InputWrapper, SelectionCards } from 'components/_inputs';

const InformationCaptureComponent = () => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { label, labelTodo, log, valueSet } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control } = useForm();

    // Hook: Salesforce setup
    const { sfUpdate } = useSalesForce();

    // Store: Wizard navigation
    const { setCurrentSubmitHandler } = useWizardNavigationStore();

    // Store: Initiative data
    const { initiative, setConfigurationType } = useInitiativeDataStore();

    // Method: Submit page content
    async function submit(formData) {
        const { Configuration_Type__c } = formData;

        await sfUpdate({
            object: 'Initiative__c',
            id: initiative.Id,
            data: {
                Configuration_Type__c: Configuration_Type__c.join(';'),
            },
        });

        // setConfigurationType(Configuration_Type__c);
        await utilities.updateInitiative(initiative.Id);
    }

    // Add submit handler to wizard navigation store
    useEffect(() => {
        setTimeout(() => {
            setCurrentSubmitHandler(handleSubmit(submit));
        }, 100);
    }, [initiative]);

    return (
        <>
            <TitlePreamble
                title={label('custom.FA_InitiativeWizardConfigureHeading')}
                preamble={label(
                    'custom.FA_InitiativeWizardConfigureSubHeading'
                )}
            />
            <InputWrapper>
                <SelectionCards
                    controller={control}
                    defaultValue={
                        initiative?.Configuration_Type__c?.split(';') ?? [
                            'Reporting',
                        ]
                    }
                    name="Configuration_Type__c"
                    options={[
                        {
                            label: valueSet(
                                'initiative.Configuration_Type__c'
                            ).find(item => item.value === 'Reporting').label,
                            value: 'Reporting',
                            details: label(
                                'custom.FA_InitiativeWizardConfigureReportingText'
                            ),
                            required: true,
                        },
                        // {
                        //     label: valueSet(
                        //         'initiative.Configuration_Type__c'
                        //     ).find(item => item.value === 'Planning').label,
                        //     value: 'Planning',
                        //     details:
                        //         label('custom.FA_InitiativeWizardConfigurePlanningText'),
                        // },
                        // {
                        //     label: valueSet(
                        //         'initiative.Configuration_Type__c'
                        //     ).find(item => item.value === 'Explain').label,
                        //     value: 'Explain',
                        //     details: label('custom.FA_InitiativeWizardConfigureExplainText'),
                        // },
                    ]}
                />
            </InputWrapper>
        </>
    );
};

InformationCaptureComponent.propTypes = {};

InformationCaptureComponent.defaultProps = {};

InformationCaptureComponent.layout = 'wizardBlank';

export default InformationCaptureComponent;
