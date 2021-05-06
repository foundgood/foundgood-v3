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
    const { labelTodo } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control } = useForm();

    // Hook: Salesforce setup
    const { sfUpdate } = useSalesForce();

    // Store: Wizard navigation
    const { addSubmitHandler } = useWizardNavigationStore();

    // Store: Initiative data
    const {
        initiative,
        updateInitiative,
        setConfigurationType,
    } = useInitiativeDataStore();

    // Method: Submit page content
    async function submit(data) {
        const { configurationType } = data;

        await sfUpdate({
            object: 'Initiative__c',
            id: initiative.id,
            data: {
                Configuration_Type__c: configurationType.join(';'),
            },
        });

        updateInitiative({ configurationType });

        setConfigurationType(configurationType);
    }

    // Add submit handler to wizard navigation store
    useEffect(() => {
        setTimeout(() => {
            addSubmitHandler(handleSubmit(submit));
        }, 10);
    }, []);

    return (
        <>
            <TitlePreamble
                title={labelTodo('Capture the information you want')}
                preamble={labelTodo('Choose the way you want to use foundgood')}
            />
            <InputWrapper>
                <SelectionCards
                    controller={control}
                    defaultValue={
                        initiative?.configurationType ?? [
                            'Reporting',
                            'Planning',
                        ]
                    }
                    name="configurationType"
                    options={[
                        {
                            label: 'Reporting',
                            value: 'Reporting',
                            details:
                                'Use Foundgood to capture all the neccessary required information to help you structure reports to your grant givers.',
                            required: true,
                        },
                        {
                            label: 'Planning',
                            value: 'Planning',
                            details:
                                'Use Foundgood to capture all the neccessary required information to help you structure reports to your grant givers.',
                        },
                        {
                            label: 'Detailing',
                            value: 'Explain',
                            details:
                                'Use Foundgood to capture all the neccessary required information to help you structure reports to your grant givers.',
                        },
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
