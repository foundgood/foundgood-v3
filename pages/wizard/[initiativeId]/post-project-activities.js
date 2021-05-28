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

const PostProjectActivitiesComponent = () => {
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
    const { initiative, updateReport, getReport } = useInitiativeDataStore();

    // Method: Submit page content
    async function submit(formData) {
        console.log('REPORT_ID: ', REPORT_ID);
        try {
            const { Post_Project_Activities__c } = formData;

            console.log('formData 2: ', formData);

            await sfUpdate({
                object: 'Initiative_Report__c',
                id: REPORT_ID,
                data: {
                    Post_Project_Activities__c,
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
    const currentReport = getReport(REPORT_ID);

    return (
        <>
            <TitlePreamble
                // title={label(currentItem?.item?.labels?.form?.title)}
                // preamble={label(currentItem?.item?.labels?.form?.preamble)}
                title={labelTodo('Title - Post project activity')}
                preamble={labelTodo('Preamble - Post project activity')}
            />
            <InputWrapper>
                <Reflection
                    name="Post_Project_Activities__c"
                    defaultValue={currentReport.Post_Project_Activities__c}
                    label={label(
                        'custom.FA_ReportWizardPostProjectReflectionSubHeading'
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

PostProjectActivitiesComponent.propTypes = {};

PostProjectActivitiesComponent.defaultProps = {};

PostProjectActivitiesComponent.layout = 'wizard';

export default PostProjectActivitiesComponent;
