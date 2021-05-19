// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';

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
import {
    InputWrapper,
    Select,
    Text,
    DatePicker,
    LongText,
    SelectList,
    DateRange,
} from 'components/_inputs';

const ReportDetailsComponent = () => {
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
    const {
        updateReport,
        getReport,
        isNovoLeadFunder,
    } = useInitiativeDataStore();

    // Method: Submit page content
    async function submit(formData) {
        try {
            const {
                Name,
                Report_Type__c,
                Due_Date__c,
                ReportDuration,
            } = formData;

            await sfUpdate({
                object: 'Initiative_Report__c',
                id: REPORT_ID,
                data: {
                    Name,
                    Report_Type__c,
                    Due_Date__c,
                    Report_Period_Start_Date__c: ReportDuration.from,
                    Report_Period_End_Date__c: ReportDuration.to,
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
    const [currentReport] = useState(getReport(REPORT_ID));

    return (
        <>
            <TitlePreamble
                title={labelTodo('Report details')}
                preamble={labelTodo('Preamble')}
            />
            <InputWrapper>
                <Text
                    name="Name"
                    defaultValue={currentReport.Name}
                    label={labelTodo('Report title')}
                    placeholder={labelTodo('Title of report')}
                    maxLength={80}
                    disabled={isNovoLeadFunder()}
                    required={!isNovoLeadFunder()}
                    controller={control}
                />
                <Select
                    name="Report_Type__c"
                    defaultValue={currentReport.Report_Type__c}
                    label={labelTodo('Report type')}
                    placeholder={labelTodo('Type')}
                    options={valueSet('initiativeReport.Report_Type__c')}
                    disabled={isNovoLeadFunder()}
                    required={!isNovoLeadFunder()}
                    controller={control}
                />
                <DatePicker
                    name="Due_Date__c"
                    defaultValue={currentReport.Due_Date__c}
                    label={labelTodo('Report deadline')}
                    controller={control}
                    disabled={isNovoLeadFunder()}
                    required={!isNovoLeadFunder()}
                />
                <DateRange
                    name="ReportDuration"
                    defaultValue={{
                        from: currentReport.Report_Period_Start_Date__c,
                        to: currentReport.Report_Period_End_Date__c,
                    }}
                    disabled={isNovoLeadFunder()}
                    label={labelTodo('Report duration')}
                    controller={control}
                    required={!isNovoLeadFunder()}
                />
            </InputWrapper>
        </>
    );
};

ReportDetailsComponent.propTypes = {};

ReportDetailsComponent.defaultProps = {};

ReportDetailsComponent.layout = 'wizard';

export default ReportDetailsComponent;
