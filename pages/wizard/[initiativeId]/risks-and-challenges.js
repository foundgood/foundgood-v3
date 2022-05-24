// React
import React from 'react';

// Packages
import { useForm } from 'react-hook-form';

// Utilities
import {
    useContext,
    useElseware,
    useLabels,
    useWizardSubmit,
} from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import WithPermission from 'components/withPermission';
import TitlePreamble from 'components/_wizard/titlePreamble';
import { InputWrapper, Reflection } from 'components/_inputs';

const RisksAndChallengesComponent = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { CONTEXTS, REPORT_ID } = useContext();
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
                    name="Summary_Of_Initiative_Risks__c"
                    defaultValue={currentReport.Summary_Of_Initiative_Risks__c}
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

RisksAndChallengesComponent.propTypes = {};

RisksAndChallengesComponent.defaultProps = {};

RisksAndChallengesComponent.layout = 'wizard';

RisksAndChallengesComponent.permissions = 'context';

export default WithAuth(WithPermission(RisksAndChallengesComponent));
