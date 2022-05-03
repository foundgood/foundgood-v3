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
import { InputWrapper, Reflection } from 'components/_inputs';

const RisksAndChallengesComponent = () => {
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

    const { CONTEXTS, REPORT_ID } = useContext();
    const { label } = useLabels();
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
            const { Summary_Of_Initiative_Risks__c } = formData;

            // Update
            const reportData = await ewUpdate(
                'initiative-report/initiative-report',
                REPORT_ID,
                {
                    Summary_Of_Initiative_Risks__c,
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

    return (
        <>
            <TitlePreamble />
            <InputWrapper>
                <Reflection
                    name="Summary_Of_Initiative_Risks__c"
                    defaultValue={currentReport.Summary_Of_Initiative_Risks__c}
                    label={label('ReportWizardChallengesReflectionSubHeading')}
                    placeholder={label('FormCaptureTextEntryEmpty')}
                    maxLength={750}
                    required
                    controller={control}
                />
            </InputWrapper>
        </>
    );
};

RisksAndChallengesComponent.propTypes = {};

RisksAndChallengesComponent.defaultProps = {};

RisksAndChallengesComponent.layout = 'wizard';

export default RisksAndChallengesComponent;
