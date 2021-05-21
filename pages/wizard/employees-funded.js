// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import _get from 'lodash.get';

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

const EmployeesFundedComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Context for wizard pages
    const { MODE, CONTEXTS, UPDATE, REPORT_ID } = useContextMode();

    // Hook: Metadata
    const { labelTodo, label, valueSet, log, helpText } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control, setValue, reset } = useForm();
    const {
        handleSubmit: handleSubmitReflections,
        control: controlReflections,
    } = useForm();
    const { isDirty } = useFormState({ control });

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

    // Store: Wizard navigation
    const { setCurrentSubmitHandler, currentItem } = useWizardNavigationStore();

    // Store: Initiative data
    const {
        initiative,
        updateEmployeeFunded,
        getReportDetails,
        updateReportDetails,
        CONSTANTS,
    } = useInitiativeDataStore();

    // Method: Save new item, returns id
    async function save(object, data) {
        const id = await sfCreate({ object, data });
        return id;
    }

    // Method: Update current item, returns id
    async function update(object, data, id) {
        await sfUpdate({ object, data, id });
        return id;
    }

    // Method: Adds founder to sf and updates founder list in view
    async function submit(formData) {
        try {
            const {
                Gender,
                Job_Title__c,
                Role_Type__c,
                Percent_Involvement__c,
            } = formData;

            // Object name
            const object = 'Initiative_Employee_Funded__c';

            // Data for sf
            const data = {
                Job_Title__c,
                Role_Type__c,
                Gender__c: Gender[0]?.selectValue,
                Gender_Other__c: Gender[0]?.textValue,
                Percent_Involvement__c,
            };

            // Update / Save
            const employeeFundedId = updateId
                ? await update(object, data, updateId)
                : await save(object, { ...data, Initiative__c: initiative.Id });

            // Update store
            await updateEmployeeFunded(employeeFundedId);

            // Close modal
            setModalIsOpen(false);

            // Clear content in form
            reset();
        } catch (error) {
            console.warn(error);
        }
    }

    // Method: Adds reflections
    async function submitReflections(formData) {
        const { Employees_Funded_Overview } = formData;

        // Object name
        const object = 'Initiative_Report_Detail__c';

        // Check if reflection exist - then update

        const reportDetailId = currentReflection
            ? await sfUpdate({
                  object,
                  id: currentReflection.Id,
                  data: {
                      Description__c: Employees_Funded_Overview,
                  },
              })
            : await sfCreate({
                  object,
                  data: {
                      Type__c: CONSTANTS.TYPES.EMPLOYEES_FUNDED_OVERVIEW,
                      Description__c: Employees_Funded_Overview,
                      Initiative_Report__c: REPORT_ID,
                  },
              });

        // Update affected activity goals
        await updateReportDetails([reportDetailId]);
    }

    // Method: Form error/validation handler
    function error(error) {
        console.warn('Form invalid', error);
        throw error;
    }

    // Local state to handle modal
    const [modalIsOpen, setModalIsOpen] = useState(false);

    // We set an update id when updating and remove when adding
    const [updateId, setUpdateId] = useState(null);

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const {
            Job_Title__c,
            Role_Type__c,
            Gender__c,
            Gender_Other__c,
            Percent_Involvement__c,
        } = initiative?._employeesFunded[updateId] ?? {};

        setValue('Job_Title__c', Job_Title__c);
        setValue('Role_Type__c', Role_Type__c);
        setValue('Gender', [
            {
                selectValue: Gender__c,
                textValue: Gender_Other__c,
            },
        ]);
        setValue('Percent_Involvement__c', Percent_Involvement__c);
    }, [updateId, modalIsOpen]);

    // Add submit handler to wizard navigation store
    useEffect(() => {
        if (MODE === CONTEXTS.REPORT) {
            setTimeout(() => {
                setCurrentSubmitHandler(
                    handleSubmitReflections(submitReflections, error)
                );
            }, 10);
        }
    }, []);

    // Current report details
    const currentReportDetails = getReportDetails(REPORT_ID);
    const currentReflection = currentReportDetails.find(
        detail => detail.Type__c === CONSTANTS.TYPES.EMPLOYEES_FUNDED_OVERVIEW
    );
    return (
        <>
            <TitlePreamble
                title={label(currentItem?.item?.labels?.form?.title)}
                preamble={label(currentItem?.item?.labels?.form?.preamble)}
            />
            <InputWrapper>
                {Object.keys(initiative._employeesFunded).map(employeeKey => {
                    const employee = initiative._employeesFunded[employeeKey];
                    return (
                        <ProjectMemberCard
                            key={employeeKey}
                            headline={_get(employee, 'Job_Title__c') || ''}
                            label={_get(employee, 'Role_Type__c') || ''}
                            body={`${_get(employee, 'Gender__c') || ''} ${
                                employee.Gender__c &&
                                employee.Percent_Involvement__c
                                    ? '•'
                                    : ''
                            } ${
                                _get(employee, 'Percent_Involvement__c') || ''
                            } %`}
                            action={() => {
                                setUpdateId(employeeKey);
                                setModalIsOpen(true);
                            }}
                        />
                    );
                })}
                <Button
                    theme="teal"
                    className="self-start"
                    action={() => {
                        setUpdateId(null);
                        setModalIsOpen(true);
                    }}>
                    {label('custom.FA_ButtonAddEmployee')}
                </Button>
                {MODE === CONTEXTS.REPORT && (
                    <Reflection
                        name="Employees_Funded_Overview"
                        defaultValue={currentReflection.Description__c}
                        label={label(
                            'custom.FA_ReportWizardEmployeesReflectionSubHeading'
                        )}
                        placeholder={labelTodo('Enter reflections')}
                        maxLength={750}
                        required
                        controller={controlReflections}
                    />
                )}
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={labelTodo('Add employee')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty}
                onSave={handleSubmit(submit)}>
                <InputWrapper>
                    <Text
                        name="Job_Title__c"
                        label={label(
                            'objects.initiativeEmployeeFunded.Job_Title__c'
                        )}
                        subLabel={helpText(
                            'objects.initiativeEmployeeFunded.Job_Title__c'
                        )}
                        placeholder={labelTodo('TEXT_PLACEHOLDER')}
                        maxLength={80}
                        required
                        controller={control}
                    />
                    <Select
                        name="Role_Type__c"
                        label={label(
                            'objects.initiativeEmployeeFunded.Role_Type__c'
                        )}
                        subLabel={helpText(
                            'objects.initiativeEmployeeFunded.Role_Type__c'
                        )}
                        placeholder={labelTodo('SELECT_PLACEHOLDER')}
                        options={valueSet(
                            'initiativeEmployeeFunded.Role_Type__c'
                        )}
                        required
                        controller={control}
                    />
                    <SelectList
                        name="Gender"
                        label={label(
                            'objects.initiativeEmployeeFunded.Gender__c'
                        )}
                        subLabel={helpText(
                            'objects.initiativeEmployeeFunded.Gender__c'
                        )}
                        selectPlaceholder={labelTodo('SELECT_PLACEHOLDER')}
                        textPlaceholder={label(
                            'objects.initiativeEmployeeFunded.Gender_Other__c'
                        )}
                        options={valueSet('initiativeEmployeeFunded.Gender__c')}
                        showText
                        listMaxLength={1}
                        controller={control}
                    />
                    <Number
                        name="Percent_Involvement__c"
                        label={label(
                            'objects.initiativeEmployeeFunded.Percent_Involvement__c'
                        )}
                        subLabel={helpText(
                            'objects.initiativeEmployeeFunded.Percent_Involvement__c'
                        )}
                        placeholder={labelTodo('NUMBER_PLACEHOLDER')}
                        minValue={0}
                        maxValue={100}
                        controller={control}
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
