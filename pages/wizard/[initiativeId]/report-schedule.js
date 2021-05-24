// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import { useAuth, useMetadata, useSalesForce } from 'utilities/hooks';
import {
    useInitiativeDataStore,
    useWizardNavigationStore,
} from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import Modal from 'components/modal';
import {
    InputWrapper,
    Select,
    DateRange,
    DatePicker,
} from 'components/_inputs';
import ReportCard from 'components/_wizard/reportCard';

const ReportScheduleComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo, valueSet, label, helpText, log } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control, setValue, reset } = useForm();
    const { isDirty } = useFormState({ control });

    // Store: Wizard navigation
    const { currentItem } = useWizardNavigationStore();

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

    // Store: Initiative data
    const {
        initiative,
        updateReport,
        isNovoLeadFunder,
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
                ReportDates,
                Report_Type__c,
                Due_Date__c,
                Status__c,
            } = formData;

            // Object name
            const object = 'Initiative_Report__c';

            // Data for sf
            const data = {
                Name: `${initiative.Name} - ${funder.Account__r.Name} - ${Report_Type__c} ${Due_Date__c}`,
                Report_Period_Start_Date__c: ReportDates.from,
                Report_Period_End_Date__c: ReportDates.to,
                Report_Type__c,
                Due_Date__c,
                Status__c,
                Funder_Report__c: funder.Id,
            };

            // Update / Save
            const ReportId = updateId
                ? await update(object, data, updateId)
                : await save(object, { ...data, Initiative__c: initiative.Id });

            // Update store
            await updateReport(ReportId);

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
    const [funder, setFunder] = useState(null);

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const {
            Report_Period_Start_Date__c,
            Report_Period_End_Date__c,
            Report_Type__c,
            Due_Date__c,
            Status__c,
        } = initiative?._reports[updateId] ?? {};

        setValue('Report_Type__c', Report_Type__c);
        setValue('Due_Date__c', Due_Date__c);
        setValue('Status__c', Status__c);
        setValue('ReportDates', {
            from: Report_Period_Start_Date__c,
            to: Report_Period_End_Date__c,
        });
    }, [updateId, modalIsOpen]);

    // Funders
    const funders = Object.keys(initiative._funders);

    return (
        <>
            <TitlePreamble
                title={label(currentItem?.item?.labels?.form?.title)}
                preamble={label(currentItem?.item?.labels?.form?.preamble)}
            />
            <InputWrapper>
                {funders.length > 0 ? (
                    funders.map(funderKey => {
                        const funder = initiative?._funders[funderKey];
                        // Get report items based on funder id (funderKey) and report.Funder_Report__c
                        const reportItems = Object.keys(initiative?._reports)
                            .filter(
                                reportKey =>
                                    initiative?._reports[reportKey]
                                        .Funder_Report__c === funderKey
                            )
                            .map(reportKey => initiative?._reports[reportKey]);
                        return (
                            <ReportCard
                                key={funder.Id}
                                headline={_get(funder, 'Account__r.Name') || ''}
                                items={reportItems.map(item => ({
                                    id: item.Id,
                                    headline: labelTodo(item.Report_Type__c),
                                    dueDate: labelTodo(item.Due_Date__c),
                                }))}
                                actionCreate={() => {
                                    setModalIsOpen(true);
                                    setFunder(funder);
                                }}
                                actionUpdate={item => {
                                    setModalIsOpen(true);
                                    setUpdateId(item.id);
                                    setFunder(funder);
                                }}
                            />
                        );
                    })
                ) : (
                    <p className="t-h5">
                        {label('custom.FA_WizardEmptyStatesReports')}
                    </p>
                )}
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={label('custom.FA_WizardModalHeadingReports')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty}
                onSave={handleSubmit(submit)}>
                <InputWrapper>
                    <Select
                        name="Report_Type__c"
                        label={label('objects.initiativeReport.Report_Type__c')}
                        subLabel={helpText(
                            'objects.initiativeReport.Report_Type__c'
                        )}
                        placeholder={labelTodo('SELECT_PLACEHOLDER')}
                        options={valueSet('initiativeReport.Report_Type__c')}
                        controller={control}
                        disabled={
                            isNovoLeadFunder() &&
                            funder?.Account__c === CONSTANTS.IDS.NNF_ACCOUNT
                        }
                        required
                    />
                    <DatePicker
                        name="Due_Date__c"
                        label={label('objects.initiativeReport.Due_Date__c')}
                        subLabel={helpText(
                            'objects.initiativeReport.Due_Date__c'
                        )}
                        controller={control}
                        required
                        disabled={
                            isNovoLeadFunder() &&
                            funder?.Account__c === CONSTANTS.IDS.NNF_ACCOUNT
                        }
                    />
                    <DateRange
                        name="ReportDates"
                        label={`${label(
                            'objects.initiativeReport.Report_Period_Start_Date__c'
                        )} / ${label(
                            'objects.initiativeReport.Report_Period_End_Date__c'
                        )}`}
                        controller={control}
                    />
                    <Select
                        name="Status__c"
                        label={label('objects.initiativeReport.Status__c')}
                        subLabel={helpText(
                            'objects.initiativeReport.Status__c'
                        )}
                        placeholder={labelTodo('SELECT_PLACEHOLDER')}
                        options={valueSet('initiativeReport.Status__c')}
                        controller={control}
                    />
                </InputWrapper>
            </Modal>
        </>
    );
};

ReportScheduleComponent.propTypes = {};

ReportScheduleComponent.defaultProps = {};

ReportScheduleComponent.layout = 'wizard';

export default ReportScheduleComponent;
