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

    const { utilities } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { CONTEXTS, REPORT_ID } = useContext();
    const { label, object, pickList } = useLabels();
    const { ewUpdate } = useElseware();

    // ///////////////////
    // FORMS
    // ///////////////////

    const mainForm = useForm();

    // ///////////////////
    // SUBMIT
    // ///////////////////

    useWizardSubmit({
        [CONTEXTS.REPORT]: [
            mainForm,
            async formData => {
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
            },
        ],
    });

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
                    controller={mainForm.control}
                />
                <Select
                    name="Report_Type__c"
                    defaultValue={currentReport.Report_Type__c}
                    label={object.label('Initiative__c.Report_Type__c')}
                    subLabel={object.helpText('Initiative__c.Report_Type__c')}
                    placeholder={label('FormCaptureSelectEmpty')}
                    options={pickList('Initiative_Report__c.Report_Type__c')}
                    disabled={utilities.isNovoLeadFunder()}
                    required={!utilities.isNovoLeadFunder()}
                    controller={mainForm.control}
                />
                <DatePicker
                    name="Due_Date__c"
                    label={object.label('Initiative__c.Due_Date__c')}
                    subLabel={object.helpText('Initiative__c.Due_Date__c')}
                    defaultValue={currentReport.Due_Date__c}
                    controller={mainForm.control}
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
                    controller={mainForm.control}
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
