// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useWatch, useFormState } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import {
    useAuth,
    useContext,
    useElseware,
    useLabels,
    useReflections,
    useWizardSubmit,
} from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import Button from 'components/button';
import Modal from 'components/modal';
import {
    InputWrapper,
    Select,
    SelectList,
    Text,
    Number,
    Reflection,
} from 'components/_inputs';
import ProjectMemberCard from 'components/_wizard/projectMemberCard';
import NoReflections from 'components/_wizard/noReflections';

const EmployeesFundedComponent = ({ pageProps }) => {
    // ///////////////////
    // AUTH
    // ///////////////////

    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { MODE, CONTEXTS, REPORT_ID } = useContext();
    const { label, object, valueSet } = useLabels();
    const { ewCreateUpdateWrapper } = useElseware();
    const { submitNoReflection, submitReflection } = useReflections({
        dataSet() {
            return utilities.collaborators.getTypeAdditional;
        },
        reflectionKey: 'Employees_Funded_Overview',
        type: CONSTANTS.REPORT_DETAILS.EMPLOYEES_FUNDED_OVERVIEW,
    });

    // ///////////////////
    // STATE
    // ///////////////////

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsSaving, setModalIsSaving] = useState(false);
    const [reflecting, setReflecting] = useState(false);
    const [updateId, setUpdateId] = useState(null);

    // ///////////////////
    // FORMS
    // ///////////////////

    const mainForm = useForm();
    const reflectionForm = useForm();
    const reflectSelected = useWatch({
        control: reflectionForm.control,
        name: 'Employees_Funded_Overview',
    });
    const { isDirty } = useFormState({ control: mainForm.control });

    // ///////////////////
    // SUBMIT
    // ///////////////////

    async function submit(formData) {
        // Modal save button state
        setModalIsSaving(true);
        try {
            const {
                Gender,
                Job_Title__c,
                Role_Type__c,
                Percent_Involvement__c,
            } = formData;

            // Data for sf
            const data = {
                Job_Title__c,
                Role_Type__c,
                Gender__c: Gender[0]?.selectValue,
                Gender_Other__c: Gender[0]?.textValue,
                Percent_Involvement__c,
            };

            // Update / Save
            await ewCreateUpdateWrapper(
                'initiative-employee-funded/initiative-employee-funded',
                updateId,
                data,
                { Initiative__c: utilities.initiative.get().Id },
                '_employeesFunded'
            );

            // Close modal
            setModalIsOpen(false);

            // Modal save button state
            setModalIsSaving(false);

            // Clear content in form
            mainForm.reset();
        } catch (error) {
            // Modal save button state
            setModalIsSaving(false);
            console.warn(error);
        }
    }

    useWizardSubmit({
        [CONTEXTS.REPORT]: [mainForm, submitReflection],
    });

    // ///////////////////
    // DATA
    // ///////////////////

    // Current report detail
    const currentReflection = utilities.reportDetails.getTypeEmployeesFundedFromReportId(
        REPORT_ID
    );

    // Get emloyeesFunded
    const employeesFunded = utilities.employeesFunded.getAll();

    // ///////////////////
    // EFFECTS
    // ///////////////////

    // Effect: Run reflectAction on reflectSelected change in order to propagate event up
    useEffect(() => {
        setReflecting(
            reflectSelected && reflectSelected.length > 0 ? true : false
        );
    }, [reflectSelected]);

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const {
            Job_Title__c,
            Role_Type__c,
            Gender__c,
            Gender_Other__c,
            Percent_Involvement__c,
        } = utilities.employeesFunded.get(updateId);

        mainForm.setValue('Job_Title__c', Job_Title__c);
        mainForm.setValue('Role_Type__c', Role_Type__c);
        mainForm.setValue('Gender', [
            {
                selectValue: Gender__c,
                textValue: Gender_Other__c,
            },
        ]);
        mainForm.setValue('Percent_Involvement__c', Percent_Involvement__c);
    }, [updateId, modalIsOpen]);

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <>
            <TitlePreamble />
            <InputWrapper>
                {MODE === CONTEXTS.REPORT && employeesFunded.length > 0 && (
                    <NoReflections
                        onClick={submitNoReflection}
                        reflectionItems={[currentReflection?.Description__c]}
                        reflecting={reflecting}
                    />
                )}
                {MODE === CONTEXTS.REPORT && (
                    <Reflection
                        name="Employees_Funded_Overview"
                        defaultValue={
                            currentReflection?.Description__c ===
                            CONSTANTS.CUSTOM.NO_REFLECTIONS
                                ? ''
                                : currentReflection?.Description__c
                        }
                        label={label(
                            'ReportWizardEmployeesReflectionSubHeading'
                        )}
                        placeholder={label('FormCaptureTextEntryEmpty')}
                        maxLength={750}
                        controller={reflectionForm.control}
                    />
                )}
                {employeesFunded.map(employee => (
                    <ProjectMemberCard
                        key={employee.Id}
                        headline={_get(employee, 'Job_Title__c') || ''}
                        label={_get(employee, 'Role_Type__c') || ''}
                        body={`${_get(employee, 'Gender__c') || ''} ${
                            employee.Gender__c &&
                            employee.Percent_Involvement__c
                                ? '•'
                                : ''
                        } ${_get(employee, 'Percent_Involvement__c') || ''} %`}
                        action={() => {
                            setUpdateId(employee.Id);
                            setModalIsOpen(true);
                        }}
                    />
                ))}
                <Button
                    theme="teal"
                    className="self-start"
                    action={() => {
                        setUpdateId(null);
                        setModalIsOpen(true);
                    }}>
                    {label('ButtonAddEmployee')}
                </Button>
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={label('WizardModalHeadingEmployees')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty || modalIsSaving}
                onSave={mainForm.handleSubmit(submit)}>
                <InputWrapper>
                    <Text
                        name="Job_Title__c"
                        label={object.label(
                            'Initiative_Employee_Funded__c.Job_Title__c'
                        )}
                        subLabel={object.helpText(
                            'Initiative_Employee_Funded__c.Job_Title__c'
                        )}
                        placeholder={label('FormCaptureTextEntryEmpty')}
                        maxLength={80}
                        required
                        controller={mainForm.control}
                    />
                    <Select
                        name="Role_Type__c"
                        label={object.label(
                            'Initiative_Employee_Funded__c.Role_Type__c'
                        )}
                        subLabel={object.helpText(
                            'Initiative_Employee_Funded__c.Role_Type__c'
                        )}
                        placeholder={label('FormCaptureSelectEmpty')}
                        options={valueSet(
                            'initiativeEmployeeFunded.Role_Type__c'
                        )}
                        required
                        controller={mainForm.control}
                    />
                    <SelectList
                        name="Gender"
                        label={object.label(
                            'Initiative_Employee_Funded__c.Gender__c'
                        )}
                        subLabel={object.helpText(
                            'Initiative_Employee_Funded__c.Gender__c'
                        )}
                        selectPlaceholder={label('FormCaptureSelectEmpty')}
                        textPlaceholder={object.label(
                            'Initiative_Employee_Funded__c.Gender_Other__c'
                        )}
                        options={valueSet('initiativeEmployeeFunded.Gender__c')}
                        showText
                        listMaxLength={1}
                        controller={mainForm.control}
                    />
                    <Number
                        name="Percent_Involvement__c"
                        label={object.label(
                            'Initiative_Employee_Funded__c.Percent_Involvement__c'
                        )}
                        subLabel={object.helpText(
                            'Initiative_Employee_Funded__c.Percent_Involvement__c'
                        )}
                        placeholder={label('FormCaptureNumberEmpty')}
                        minValue={0}
                        maxValue={100}
                        controller={mainForm.control}
                    />
                </InputWrapper>
            </Modal>
        </>
    );
};

EmployeesFundedComponent.propTypes = {};

EmployeesFundedComponent.defaultProps = {};

EmployeesFundedComponent.layout = 'wizard';

export default EmployeesFundedComponent;
