// React
import React, { useEffect } from 'react';

// Packages
import { useForm } from 'react-hook-form';

// Utilities
import { useAuth, useLabels, useContext } from 'utilities/hooks';
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
    // ///////////////////
    // AUTH
    // ///////////////////

    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // ///////////////////
    // STORES
    // ///////////////////

    const { setCurrentSubmitHandler } = useWizardNavigationStore();
    const { initiative, utilities } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { REPORT_ID, CONTEXTS } = useContext();
    const { label, object, valueSet } = useLabels();
    const { ewUpdate } = useElseware();

    // ///////////////////
    // FORMS
    // ///////////////////

    const { handleSubmit, control } = useForm();

    // ///////////////////
    // METHODS
    // ///////////////////

    // Method: Submit page content
    async function submit(formData) {
        try {
            const {
                Name,
                Report_Type__c,
                Due_Date__c,
                ReportDuration,
            } = formData;

            const reportData = await ewUpdate(
                'initiative-report/initiative-report',
                REPORT_ID,
                {
                    Name,
                    Report_Type__c,
                    Due_Date__c,
                    Report_Period_Start_Date__c: ReportDuration.from,
                    Report_Period_End_Date__c: ReportDuration.to,
                }
            );

            // Update store
            utilities.updateInitiativeData('_reports', reportData);
        } catch (error) {
            console.warn(error);
        }
    }

    // Method: Form error/validation handler
    function error(error) {
        console.warn('Form invalid', error);
        throw error;
    }

    // ///////////////////
    // EFFECTS
    // ///////////////////

    // Add submit handler to wizard navigation store
    useEffect(() => {
        setTimeout(() => {
            setCurrentSubmitHandler(handleSubmit(submit, error));
        }, 100);
    }, [initiative]);

    // ///////////////////
    // DATA
    // ///////////////////

    // Get current report
    const currentReport = utilities.reports.get(REPORT_ID);

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <>
            <TitlePreamble />
            <InputWrapper>
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
                    placeholder={label('FormCaptureSelectEmpty')}
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
