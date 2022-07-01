// React
import React from 'react';

// Packages

// Utilities
import { useElseware, useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import WithPermission from 'components/withPermission';
import TitlePreamble from 'components/_wizard/titlePreamble';
import ReportUpdatesInPage from 'components/_wizard/reportUpdatesInPage';
import Collection from 'components/_wizard/collection';
import { ReportUpdate } from 'components/_wizard/_cards';
import EmployeesFunded from 'components/_wizard/_cards/_cardContents/employeesFunded';

const EmployeesFundedComponent = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label, object, pickList } = useLabels();
    const {
        ewUpdate,
        ewCreate,
        ewDelete,
        ewDeleteItemsWrapper,
    } = useElseware();

    // ///////////////////
    // METHODS
    // ///////////////////

    function getItemData(formData) {
        const {
            Full_Name__c,
            Job_Title__c,
            Role_Type__c,
            DateRange,
            Education__c,
            Education_Details__c,
            Gender,
            Percent_Involvement__c,
        } = formData;

        // Data for sf
        return {
            Full_Name__c,
            Job_Title__c,
            Role_Type__c,
            Start_Date__c: DateRange.from,
            End_Date__c: DateRange.to,
            Education__c,
            Education_Details__c,
            Gender__c: Gender[0]?.selectValue,
            Gender_Other__c: Gender[0]?.textValue,
            Percent_Involvement__c,
        };
    }

    async function addItem(formData) {
        const { data: itemData } = await ewCreate(
            'initiative-employee-funded/initiative-employee-funded',
            {
                ...getItemData(formData),
                Initiative__c: utilities.initiative.get().Id,
            }
        );

        // Update main data
        utilities.updateInitiativeData('_employeesFunded', itemData);
    }

    async function editItem(formData, id) {
        const { data: itemData } = await ewUpdate(
            'initiative-employee-funded/initiative-employee-funded',
            id,
            getItemData(formData)
        );

        // Update main data
        utilities.updateInitiativeData('_employeesFunded', itemData);
    }

    async function deleteItem(id) {
        // Delete relations
        await ewDeleteItemsWrapper(
            utilities.activityEmployees.getFromEmployeeId(id),
            'initiative-activity-employee/initiative-activity-employee',
            '_activityEmployees'
        );

        // Delete
        await ewDelete(
            'initiative-employee-funded/initiative-employee-funded',
            id
        );

        // Clean out item
        utilities.removeInitiativeData('_employeesFunded', id);
    }

    function setItemFieldValues(form, id) {
        const {
            Full_Name__c,
            Job_Title__c,
            Role_Type__c,
            Start_Date__c,
            End_Date__c,
            Education__c,
            Education_Details__c,
            Gender__c,
            Gender_Other__c,
            Percent_Involvement__c,
        } = utilities.employeesFunded.get(id);

        form.setValue('Full_Name__c', Full_Name__c);
        form.setValue('Job_Title__c', Job_Title__c);
        form.setValue('Role_Type__c', Role_Type__c);
        form.setValue('DateRange', { from: Start_Date__c, to: End_Date__c });
        form.setValue('Education__c', Education__c);
        form.setValue('Education_Details__c', Education_Details__c);
        form.setValue('Gender', [
            {
                selectValue: Gender__c,
                textValue: Gender_Other__c,
            },
        ]);
        form.setValue('Percent_Involvement__c', Percent_Involvement__c);
    }

    // ///////////////////
    // DATA
    // ///////////////////

    // Get emloyeesFunded
    const employeesFunded = utilities.employeesFunded.getAll();

    // ///////////////////
    // FIELDS
    // ///////////////////

    function itemFields() {
        return [
            {
                type: 'Text',
                name: 'Full_Name__c',
                label: object.label(
                    'Initiative_Employee_Funded__c.Full_Name__c'
                ),
                subLabel: object.helpText(
                    'Initiative_Employee_Funded__c.Full_Name__c'
                ),
                required: true,
                maxLength: 80,
            },
            {
                type: 'Text',
                name: 'Job_Title__c',
                label: object.label(
                    'Initiative_Employee_Funded__c.Job_Title__c'
                ),
                subLabel: object.helpText(
                    'Initiative_Employee_Funded__c.Job_Title__c'
                ),
                required: true,
                maxLength: 80,
            },
            {
                type: 'Select',
                name: 'Role_Type__c',
                label: object.label(
                    'Initiative_Employee_Funded__c.Role_Type__c'
                ),
                subLabel: object.helpText(
                    'Initiative_Employee_Funded__c.Role_Type__c'
                ),
                options: pickList('Initiative_Employee_Funded__c.Role_Type__c'),
                required: true,
            },
            {
                type: 'DateRange',
                name: 'DateRange',
                label: `${object.label(
                    'Initiative_Employee_Funded__c.Grant_Start_Date__c'
                )} / ${object.label(
                    'Initiative_Employee_Funded__c.Grant_End_Date__c'
                )}`,
            },
            {
                type: 'Select',
                name: 'Education__c',
                label: object.label(
                    'Initiative_Employee_Funded__c.Education__c'
                ),
                subLabel: object.helpText(
                    'Initiative_Employee_Funded__c.Education__c'
                ),
                options: pickList('Initiative_Employee_Funded__c.Education__c'),
            },
            {
                type: 'Text',
                name: 'Education_Details__c',
                label: object.label(
                    'Initiative_Employee_Funded__c.Education_Details__c'
                ),
                subLabel: object.helpText(
                    'Initiative_Employee_Funded__c.Education_Details__c'
                ),
                maxLength: 80,
            },
            {
                type: 'SelectList',
                name: 'Gender',
                label: object.label('Initiative_Employee_Funded__c.Gender__c'),
                subLabel: object.helpText(
                    'Initiative_Employee_Funded__c.Gender__c'
                ),
                showText: true,
                listMaxLength: 1,
                options: pickList('Initiative_Employee_Funded__c.Gender__c'),
                textPlaceholder: object.label(
                    'Initiative_Activity_Success_Metric__c.Gender_Other__c'
                ),
            },
            {
                type: 'Number',
                name: 'Percent_Involvement__c',
                label: object.label(
                    'Initiative_Employee_Funded__c.Percent_Involvement__c'
                ),
                subLabel: object.helpText(
                    'Initiative_Employee_Funded__c.Percent_Involvement__c'
                ),
                minValue: 0,
                maxValue: 100,
            },
        ];
    }

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <WithPermission context>
            <TitlePreamble />
            <ReportUpdatesInPage
                {...{
                    items: employeesFunded,
                    itemRelationKey: 'Initiative_Employee_Funded__c',
                }}
            />
            <Collection
                {...{
                    collection: {
                        items: employeesFunded,
                        fields: itemFields,
                        addLabel: label('ButtonAddEmployee'),
                        emptyLabel: label(
                            'EmptyStateWizardPageEmployeesFunded'
                        ),
                    },
                    methods: {
                        add: {
                            title: label('WizardModalHeadingEmployeesFunded'),
                            action: addItem,
                        },
                        edit: {
                            title: label('WizardModalHeadingEmployeesFunded'),
                            action: editItem,
                            setFieldValues: setItemFieldValues,
                        },
                        delete: {
                            title: label(
                                'WizardModalHeadingEmployeesFundedDelete'
                            ),
                            text: label('WizardModalTextEmployeesFundedDelete'),
                            action: deleteItem,
                        },
                    },
                    card: {
                        title(item) {
                            return item?.Full_Name__c;
                        },
                        type(item) {
                            return item?.Job_Title__c;
                        },
                        components(item) {
                            return {
                                cardContent: <EmployeesFunded {...{ item }} />,
                                reportUpdate: (
                                    <ReportUpdate
                                        {...{
                                            title: label(
                                                'ReportUpdateModalEmployeesFundedHeading'
                                            ),
                                            reflection: {
                                                item,
                                                relationKey:
                                                    'Initiative_Employee_Funded__c',
                                                type:
                                                    CONSTANTS.REPORT_DETAILS
                                                        .EMPLOYEES_FUNDED_OVERVIEW,
                                            },
                                        }}
                                    />
                                ),
                            };
                        },
                    },
                }}
            />
        </WithPermission>
    );
};

EmployeesFundedComponent.propTypes = {};

EmployeesFundedComponent.defaultProps = {};

EmployeesFundedComponent.layout = 'wizard';

export default WithAuth(EmployeesFundedComponent);
