// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm } from 'react-hook-form';

// Utilities
import { useAuth, useLabels, useSalesForce, useContext } from 'utilities/hooks';
import {
    useWizardNavigationStore,
    useInitiativeDataStore,
} from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import { InputWrapper, Reflection } from 'components/_inputs';

const EndOfGrantReflectionsComponent = () => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Context for wizard pages
    const { REPORT_ID } = useContext();

    // Hook: Metadata
    const { label } = useLabels();

    // Hook: useForm setup
    const { handleSubmit, control } = useForm();

    // Hook: Salesforce setup
    const { sfUpdate } = useSalesForce();

    // Store: Wizard navigation
    const { setCurrentSubmitHandler, currentItem } = useWizardNavigationStore();

    // Store: Initiative data
    const { initiative, updateReport, utilities } = useInitiativeDataStore();

    // Method: Submit page content
    async function submit(formData) {
        try {
            const {
                Project_Purpose__c,
                Progress_Towards_Grant_Area_Themes__c,
                Important_Results__c,
            } = formData;

            await sfUpdate({
                object: 'Initiative_Report__c',
                id: REPORT_ID,
                data: {
                    Project_Purpose__c,
                    Progress_Towards_Grant_Area_Themes__c,
                    Important_Results__c,
                },
            });

            await updateReport(REPORT_ID);
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

    // Get current report
    const currentReport = utilities.reports.get(REPORT_ID);

    return (
        <>
            <TitlePreamble
                title={label(currentItem?.item?.labels?.form?.title)}
                preamble={label(currentItem?.item?.labels?.form?.preamble)}
                preload={!initiative.Id}
            />
            <InputWrapper preload={!initiative.Id}>
                <Reflection
                    name="Project_Purpose__c"
                    defaultValue={currentReport.Project_Purpose__c}
                    label={label('ReportWizardPurposeReflectionSubHeading')}
                    placeholder={label('FormCaptureTextEntryEmpty')}
                    maxLength={750}
                    required
                    controller={control}
                />
                <Reflection
                    name="Progress_Towards_Grant_Area_Themes__c"
                    defaultValue={
                        currentReport.Progress_Towards_Grant_Area_Themes__c
                    }
                    label={label('ReportWizardProgressReflectionSubHeading')}
                    placeholder={label('FormCaptureTextEntryEmpty')}
                    maxLength={750}
                    required
                    controller={control}
                />
                <Reflection
                    name="Important_Results__c"
                    defaultValue={currentReport.Important_Results__c}
                    label={label('ReportWizardResultsReflectionSubHeading')}
                    placeholder={label('FormCaptureTextEntryEmpty')}
                    maxLength={750}
                    required
                    controller={control}
                />
            </InputWrapper>
        </>
    );
};

EndOfGrantReflectionsComponent.propTypes = {};

EndOfGrantReflectionsComponent.defaultProps = {};

EndOfGrantReflectionsComponent.layout = 'wizard';

export default EndOfGrantReflectionsComponent;
