// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import { useAuth, useMetadata, useSalesForce } from 'utilities/hooks';
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
    DateRange,
    DatePicker,
    LongText,
} from 'components/_inputs';
import ProjectMemberCard from 'components/_wizard/projectMemberCard';

const EmployeesFundedComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo, valueSet, log } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control, setValue, reset } = useForm();
    const { isDirty } = useFormState({ control });

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

    // Store: Initiative data
    const {
        initiative,
        updateEmployeeFunded,
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

    return (
        <>
            <TitlePreamble
                title={labelTodo('Which employees are funded by your grants?')}
                preamble={labelTodo('Preamble')}
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
                    {labelTodo('Add employee')}
                </Button>
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
                        label={labelTodo('Job title')}
                        placeholder={labelTodo('Enter job title')}
                        maxLength={80}
                        required
                        controller={control}
                    />
                    <Select
                        name="Role_Type__c"
                        label={labelTodo('Role')}
                        placeholder={labelTodo('Please select')}
                        options={valueSet(
                            'initiativeEmployeeFunded.Role_Type__c'
                        ).map(item => ({
                            label: item.label,
                            value: item.fullName,
                        }))}
                        required
                        controller={control}
                    />
                    <SelectList
                        name="Gender"
                        label={labelTodo('Gender')}
                        selectPlaceholder={labelTodo('Please select')}
                        textPlaceholder={labelTodo(
                            'If "other" feel free to specify'
                        )}
                        options={valueSet(
                            'initiativeEmployeeFunded.Gender__c'
                        ).map(item => ({
                            label: item.label,
                            value: item.fullName,
                        }))}
                        showText
                        listMaxLength={1}
                        controller={control}
                    />
                    <Text
                        name="Percent_Involvement__c"
                        label={labelTodo('Involvement')}
                        placeholder={labelTodo('Enter percentage')}
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
