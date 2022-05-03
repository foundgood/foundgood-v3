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
import { InputWrapper, Reflection } from 'components/_inputs';

const EndOfGrantReflectionsComponent = () => {
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
                        Project_Purpose__c,
                        Progress_Towards_Grant_Area_Themes__c,
                        Important_Results__c,
                    } = formData;

                    // Update
                    const reportData = await ewUpdate(
                        'initiative-report/initiative-report',
                        REPORT_ID,
                        {
                            Project_Purpose__c,
                            Progress_Towards_Grant_Area_Themes__c,
                            Important_Results__c,
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
                    name="Project_Purpose__c"
                    defaultValue={currentReport.Project_Purpose__c}
                    label={label('ReportWizardPurposeReflectionSubHeading')}
                    placeholder={label('FormCaptureTextEntryEmpty')}
                    maxLength={750}
                    required
                    controller={mainForm.control}
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
                    controller={mainForm.control}
                />
                <Reflection
                    name="Important_Results__c"
                    defaultValue={currentReport.Important_Results__c}
                    label={label('ReportWizardResultsReflectionSubHeading')}
                    placeholder={label('FormCaptureTextEntryEmpty')}
                    maxLength={750}
                    required
                    controller={mainForm.control}
                />
            </InputWrapper>
        </>
    );
};

EndOfGrantReflectionsComponent.propTypes = {};

EndOfGrantReflectionsComponent.defaultProps = {};

EndOfGrantReflectionsComponent.layout = 'wizard';

export default EndOfGrantReflectionsComponent;
