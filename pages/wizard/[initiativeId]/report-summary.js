// React
import React, { useEffect, useState } from 'react';

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
import { InputWrapper, Reflection } from 'components/_inputs';

const ReportSummaryComponent = () => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Context for wizard pages
    const { MODE, CONTEXTS, UPDATE, REPORT_ID } = useContext();

    // Hook: Metadata
    const { labelTodo, valueSet, label, helpText, log } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control } = useForm();

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

    // Store: Wizard navigation
    const { setCurrentSubmitHandler, currentItem } = useWizardNavigationStore();

    // Store: Initiative data
    const { updateReport, getReport } = useInitiativeDataStore();

    // Method: Submit page content
    async function submit(formData) {
        try {
            const {
                Summary_Of_Activities__c,
                Summary_Of_Challenges_And_Learnings__c,
            } = formData;

            await sfUpdate({
                object: 'Initiative_Report__c',
                id: REPORT_ID,
                data: {
                    Summary_Of_Activities__c,
                    Summary_Of_Challenges_And_Learnings__c,
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
    }, []);

    // Get current report
    const currentReport = getReport(REPORT_ID);

    return (
        <>
            <TitlePreamble
                title={label(currentItem?.item?.labels?.form?.title)}
                preamble={label(currentItem?.item?.labels?.form?.preamble)}
            />
            <InputWrapper>
                <Reflection
                    name="Summary_Of_Activities__c"
                    defaultValue={currentReport.Summary_Of_Activities__c}
                    label={label(
                        'custom.FA_ReportWizardActivitySummaryReflectionSubHeading'
                    )}
                    placeholder={label('custom.FA_FormCaptureTextEntryEmpty')}
                    maxLength={750}
                    required
                    controller={control}
                />
                <Reflection
                    name="Summary_Of_Challenges_And_Learnings__c"
                    defaultValue={
                        currentReport.Summary_Of_Challenges_And_Learnings__c
                    }
                    label={label(
                        'custom.FA_ReportWizardChallengesReflectionSubHeading'
                    )}
                    placeholder={label('custom.FA_FormCaptureTextEntryEmpty')}
                    maxLength={750}
                    required
                    controller={control}
                />
            </InputWrapper>
        </>
    );
};

ReportSummaryComponent.propTypes = {};

ReportSummaryComponent.defaultProps = {};

ReportSummaryComponent.layout = 'wizard';

export default ReportSummaryComponent;
