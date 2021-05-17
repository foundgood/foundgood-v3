// React
import React, { useEffect } from 'react';

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
    LongText,
    SelectList,
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
        CONSTANTS,
        initiative,
        updateReport,
        getReport,
    } = useInitiativeDataStore();

    // Get data for form
    const { data: accountGrantees } = sfQuery(queries.account.allGrantees());

    // Method: Submit page content
    async function submit(formData) {
        try {
            const {
                Name,
                Summary__c,
                Where_Is_Problem__c,
                Account__c,
                Category__c,
            } = formData;

            await sfUpdate({
                object: 'Initiative_Report__c',
                id: REPORT_ID,
                data: {
                    Name,
                    Summary__c,
                    Category__c,
                    Where_Is_Problem__c: Where_Is_Problem__c.map(
                        item => item.selectValue
                    ).join(';'),
                },
            });

            await updateReport(REPORT_ID.Id);
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

    console.log(currentReport);

    log();

    return (
        <>
            <TitlePreamble
                title={labelTodo('Report details')}
                preamble={labelTodo('Preamble')}
            />
            <InputWrapper>
                <Select
                    name="Report_Type__c"
                    defaultValue={currentReport.Report_Type__c}
                    label={labelTodo('Report type')}
                    placeholder={labelTodo('Type')}
                    options={valueSet('initiativeReport.Report_Type__c')}
                    required
                    controller={control}
                />
                <Text
                    name="Name"
                    defaultValue={initiative?.Name?.replace('___', '')}
                    label={labelTodo('What is the name of your initiative?')}
                    placeholder={labelTodo('Title of initiative')}
                    maxLength={80}
                    required
                    controller={control}
                />
                <Select
                    name="Category__c"
                    defaultValue={initiative?.Category__c}
                    label={labelTodo('Grant giving area')}
                    placeholder={labelTodo('Please select')}
                    options={valueSet('initiative.Category__c')}
                    controller={control}
                    disabled={initiative.Category__c}
                    required
                />
                <LongText
                    name="Summary__c"
                    defaultValue={initiative?.Summary__c}
                    label={labelTodo('What are your initiative about')}
                    placeholder={labelTodo(
                        "Brief description of initiative that details why it's important"
                    )}
                    maxLength={400}
                    controller={control}
                />
                <SelectList
                    name="Where_Is_Problem__c"
                    defaultValue={initiative?.Where_Is_Problem__c?.split(
                        ';'
                    ).map(value => ({
                        selectValue: value,
                    }))}
                    label={labelTodo('Where is it located?')}
                    listMaxLength={3}
                    options={valueSet('account.Location__c')}
                    selectPlaceholder={labelTodo('Please select')}
                    selectLabel={labelTodo('Country')}
                    controller={control}
                />
            </InputWrapper>
        </>
    );
};

ReportDetailsComponent.propTypes = {};

ReportDetailsComponent.defaultProps = {};

ReportDetailsComponent.layout = 'wizard';

export default ReportDetailsComponent;
