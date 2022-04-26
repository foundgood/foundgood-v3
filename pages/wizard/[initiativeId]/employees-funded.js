// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useWatch, useFormState } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import { useAuth, useMetadata, useElseware, useContext } from 'utilities/hooks';
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
import NoReflections from 'components/_wizard/noReflections';

const EmployeesFundedComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Context for wizard pages
    const { MODE, CONTEXTS, REPORT_ID } = useContext();

    // Hook: Metadata
    const { label, valueSet, helpText } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control, setValue, reset } = useForm();
    const {
        handleSubmit: handleSubmitReflections,
        control: controlReflections,
    } = useForm();

    const reflectSelected = useWatch({
        control: controlReflections,
        name: 'Employees_Funded_Overview',
    });

    const { isDirty } = useFormState({ control });

    // Hook: Elseware setup
    const { ewCreate, ewCreateUpdateWrapper } = useElseware();

    // Store: Wizard navigation
    const { setCurrentSubmitHandler, currentItem } = useWizardNavigationStore();

    // Store: Initiative data
    const { initiative, utilities, CONSTANTS } = useInitiativeDataStore();

    // Method: Adds founder to sf and updates founder list in view
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
            await ewCreateUpdateWrapper(
                'initiative-employee-funded/initiative-employee-funded',
                updateId,
                data,
                { Initiative__c: initiative.Id },
                '_employeesFunded'
            );

            // Close modal
            setModalIsOpen(false);

            // Modal save button state
            setModalIsSaving(false);

            // Clear content in form
            reset();
        } catch (error) {
            // Modal save button state
            setModalIsSaving(false);
            console.warn(error);
        }
    }

    // Method: Adds reflections
    async function submitReflections(formData) {
        const { Employees_Funded_Overview } = formData;

        // Check if reflection exist - then update
        if (Employees_Funded_Overview) {
            ewCreateUpdateWrapper(
                'initiative-report-detail/initiative-report-detail',
                currentReflection?.Id,
                {
                    Description__c: Employees_Funded_Overview,
                },
                {
                    Type__c: CONSTANTS.TYPES.EMPLOYEES_FUNDED_OVERVIEW,
                    Initiative_Report__c: REPORT_ID,
                },
                '_reportDetails'
            );
        }
    }

    // Method: Submits no reflections flag
    async function submitNoReflections() {
        const { data: reportDetailsData } = await ewCreate(
            'initiative-report-detail/initiative-report-detail',
            {
                Type__c: CONSTANTS.TYPES.EMPLOYEES_FUNDED_OVERVIEW,
                Description__c: CONSTANTS.CUSTOM.NO_REFLECTIONS,
                Initiative_Report__c: REPORT_ID,
            }
        );
        utilities.updateInitiativeData('_reportDetails', reportDetailsData);
    }

    // Method: Form error/validation handler
    function error(error) {
        console.warn('Form invalid', error);
        throw error;
    }

    // Local state to handle modal
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsSaving, setModalIsSaving] = useState(false);

    // Local state to handle reflection
    const [reflecting, setReflecting] = useState(false);
    // Effect: Run reflectAction on reflectSelected change in order to propagate event up
    useEffect(() => {
        setReflecting(
            reflectSelected && reflectSelected.length > 0 ? true : false
        );
    }, [reflectSelected]);

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
            }, 100);
        } else {
            setTimeout(() => {
                setCurrentSubmitHandler(null);
            }, 100);
        }
    }, [initiative]);

    // Current report details
    const currentReportDetails = utilities.getReportDetails(REPORT_ID);
    const currentReflection =
        currentReportDetails.find(
            detail =>
                detail.Type__c === CONSTANTS.TYPES.EMPLOYEES_FUNDED_OVERVIEW
        ) || null;

    return (
        <>
            <TitlePreamble
                title={label(currentItem?.item?.labels?.form?.title)}
                preamble={label(currentItem?.item?.labels?.form?.preamble)}
                preload={!initiative.Id}
            />
            <InputWrapper preload={!initiative.Id}>
                {MODE === CONTEXTS.REPORT &&
                    Object.values(initiative._employeesFunded).length > 0 && (
                        <NoReflections
                            onClick={submitNoReflections}
                            reflectionItems={[
                                currentReflection?.Description__c,
                            ]}
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
                            'custom.FA_ReportWizardEmployeesReflectionSubHeading'
                        )}
                        placeholder={label(
                            'custom.FA_FormCaptureTextEntryEmpty'
                        )}
                        maxLength={750}
                        controller={controlReflections}
                    />
                )}
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
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={label('custom.FA_WizardModalHeadingEmployees')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty || modalIsSaving}
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
                        placeholder={label(
                            'custom.FA_FormCaptureTextEntryEmpty'
                        )}
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
                        placeholder={label('custom.FA_FormCaptureSelectEmpty')}
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
                        selectPlaceholder={label(
                            'custom.FA_FormCaptureSelectEmpty'
                        )}
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
                        placeholder={label('custom.FA_FormCaptureNumberEmpty')}
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
