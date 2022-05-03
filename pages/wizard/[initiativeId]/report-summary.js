// React
import React from 'react';

// Packages
import { useForm } from 'react-hook-form';

// Utilities
import {
    useAuth,
    useLabels,
    useElseware,
    useContext,
    useWizardSubmit,
} from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import { InputWrapper, Reflection } from 'components/_inputs';

const ReportSummaryComponent = () => {
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

    const { REPORT_ID, CONTEXTS } = useContext();
    const { label } = useLabels();
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
                        Summary_Of_Activities__c,
                        Summary_Of_Challenges_And_Learnings__c,
                    } = formData;

                    // Update
                    const reportData = await ewUpdate(
                        'initiative-report/initiative-report',
                        REPORT_ID,
                        {
                            Summary_Of_Activities__c,
                            Summary_Of_Challenges_And_Learnings__c,
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
                <Reflection
                    name="Summary_Of_Activities__c"
                    defaultValue={currentReport.Summary_Of_Activities__c}
                    label={label(
                        'ReportWizardActivitySummaryReflectionSubHeading'
                    )}
                    placeholder={label('FormCaptureTextEntryEmpty')}
                    maxLength={750}
                    required
                    controller={mainForm.control}
                />
                <Reflection
                    name="Summary_Of_Challenges_And_Learnings__c"
                    defaultValue={
                        currentReport.Summary_Of_Challenges_And_Learnings__c
                    }
                    label={label('ReportWizardChallengesReflectionSubHeading')}
                    placeholder={label('FormCaptureTextEntryEmpty')}
                    maxLength={750}
                    required
                    controller={mainForm.control}
                />
            </InputWrapper>
        </>
    );
};

ReportSummaryComponent.propTypes = {};

ReportSummaryComponent.defaultProps = {};

ReportSummaryComponent.layout = 'wizard';

export default ReportSummaryComponent;
