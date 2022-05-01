// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';

// Utilities
import { useAuth, useLabels, useSalesForce, useContext } from 'utilities/hooks';
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
    DateRange,
} from 'components/_inputs';

const ReportDetailsComponent = () => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Context for wizard pages
    const { REPORT_ID } = useContext();

    // Hook: Metadata
    const { labelTodo, label, object, valueSet } = useLabels();

    // Hook: useForm setup
    const { handleSubmit, control } = useForm();

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

    // Store: Wizard navigation
    const { setCurrentSubmitHandler, currentItem } = useWizardNavigationStore();

    // Store: Initiative data
    const { initiative, updateReport, utilities } = useInitiativeDataStore();

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
        }, 100);
    }, [initiative]);

    // Get current report
    const currentReport = utilities.reports.get(REPORT_ID);

    return (
        <>
            <TitlePreamble
                title={label(currentItem?.item?.labels?.form?.title)}
                preamble={label(currentItem?.item?.labels?.form?.preamble)}
                preload={!initiative.Id && currentReport.Id}
            />

            <InputWrapper preload={!initiative.Id && currentReport.Id}>
                <Text
                    name="Name"
                    defaultValue={currentReport.Name}
                    label={label('ReportName')}
                    placeholder={label('FormCaptureTextEntryEmpty')}
                    maxLength={80}
                    disabled={utilities.isNovoLeadFunder()}
                    required={!utilities.isNovoLeadFunder()}
                    controller={control}
                />
                <Select
                    name="Report_Type__c"
                    defaultValue={currentReport.Report_Type__c}
                    label={object.label('Initiative__c.Report_Type__c')}
                    subLabel={object.helpText('Initiative__c.Report_Type__c')}
                    placeholder={labelTodo('Type')}
                    options={valueSet('initiativeReport.Report_Type__c')}
                    disabled={utilities.isNovoLeadFunder()}
                    required={!utilities.isNovoLeadFunder()}
                    controller={control}
                />
                <DatePicker
                    name="Due_Date__c"
                    label={object.label('Initiative__c.Due_Date__c')}
                    subLabel={object.helpText('Initiative__c.Due_Date__c')}
                    defaultValue={currentReport.Due_Date__c}
                    controller={control}
                    disabled={utilities.isNovoLeadFunder()}
                    required={!utilities.isNovoLeadFunder()}
                />
                <DateRange
                    name="ReportDuration"
                    defaultValue={{
                        from: currentReport.Report_Period_Start_Date__c,
                        to: currentReport.Report_Period_End_Date__c,
                    }}
                    disabled={utilities.isNovoLeadFunder()}
                    label={`${object.label(
                        'Initiative__c.Report_Period_Start_Date__c'
                    )} / ${object.label(
                        'Initiative__c.Report_Period_End_Date__c'
                    )}`}
                    controller={control}
                    required={!utilities.isNovoLeadFunder()}
                />
            </InputWrapper>
        </>
    );
};

ReportDetailsComponent.propTypes = {};

ReportDetailsComponent.defaultProps = {};

ReportDetailsComponent.layout = 'wizard';

export default ReportDetailsComponent;
