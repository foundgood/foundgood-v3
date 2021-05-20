// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm } from 'react-hook-form';

// Utilities
import {
    useAuth,
    useMetadata,
    useSalesForce,
    useContextMode,
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
    const { MODE, CONTEXTS, UPDATE, REPORT_ID } = useContextMode();

    // Hook: Metadata
    const { labelTodo, valueSet, log } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control } = useForm();

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

    // Store: Wizard navigation
    const { setCurrentSubmitHandler } = useWizardNavigationStore();

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
        }, 10);
    }, []);

    // Get current report
    const currentReport = getReport(REPORT_ID);

    return (
        <>
            <TitlePreamble
                title={labelTodo('Report summary')}
                preamble={labelTodo('Preamble')}
            />
            <InputWrapper>
                <Reflection
                    name="Summary_Of_Activities__c"
                    defaultValue={currentReport.Summary_Of_Activities__c}
                    label={labelTodo('Summary of activities')}
                    subLabel={labelTodo(
                        'Descriptive text that explains what to write and what the foundation is looking for.'
                    )}
                    placeholder={labelTodo('Enter summary')}
                    maxLength={750}
                    required
                    controller={control}
                />
                <Reflection
                    name="Summary_Of_Challenges_And_Learnings__c"
                    defaultValue={
                        currentReport.Summary_Of_Challenges_And_Learnings__c
                    }
                    label={labelTodo('Summary of  challenges and learnings')}
                    subLabel={labelTodo(
                        'Descriptive text that explains what to write and what the foundation is looking for.'
                    )}
                    placeholder={labelTodo('Enter summary')}
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
