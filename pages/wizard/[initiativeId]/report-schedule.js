// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import { useElseware, useLabels, useWizardSubmit } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import TitlePreamble from 'components/_wizard/titlePreamble';
import WizardModal from 'components/wizardModal';
import {
    InputWrapper,
    Select,
    DateRange,
    DatePicker,
} from 'components/_inputs';
import ReportCard from 'components/_wizard/reportCard';

const ReportScheduleComponent = ({ pageProps }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { labelTodo, label, object, pickList } = useLabels();
    const { ewCreateUpdateWrapper } = useElseware();

    // ///////////////////
    // STATE
    // ///////////////////

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsSaving, setModalIsSaving] = useState(false);
    const [updateId, setUpdateId] = useState(null);
    const [funder, setFunder] = useState(null);

    // ///////////////////
    // FORMS
    // ///////////////////

    const mainForm = useForm();
    const { isDirty } = useFormState({ control: mainForm.control });

    // ///////////////////
    // SUBMIT
    // ///////////////////

    async function submit(formData) {
        // Modal save button state
        setModalIsSaving(true);
        try {
            const { ReportDates, Report_Type__c, Due_Date__c } = formData;

            // Data for sf
            const data = {
                Name: `${utilities.initiative.get().Id} - ${
                    funder.Account__r.Name
                } - ${Report_Type__c} ${Due_Date__c}`,
                Report_Period_Start_Date__c: ReportDates.from,
                Report_Period_End_Date__c: ReportDates.to,
                Report_Type__c,
                Due_Date__c,
                Status__c: CONSTANTS.REPORTS.REPORT_NOT_STARTED,
                Funder_Report__c: funder.Id,
            };

            // Update / Save
            await ewCreateUpdateWrapper(
                'initiative-report/initiative-report',
                updateId,
                data,
                { Initiative__c: utilities.initiative.get().Id },
                '_reports'
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

    useWizardSubmit();

    // ///////////////////
    // DATA
    // ///////////////////

    // Funders
    const funders = utilities.funders.getAll();

    // ///////////////////
    // EFFECTS
    // ///////////////////

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const {
            Report_Period_Start_Date__c,
            Report_Period_End_Date__c,
            Report_Type__c,
            Due_Date__c,
        } = utilities.reports.get(updateId);

        mainForm.setValue('Report_Type__c', Report_Type__c);
        mainForm.setValue('Due_Date__c', Due_Date__c);
        mainForm.setValue('ReportDates', {
            from: Report_Period_Start_Date__c,
            to: Report_Period_End_Date__c,
        });
    }, [updateId, modalIsOpen]);

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <>
            <TitlePreamble />
            <InputWrapper>
                {funders.length > 0 ? (
                    funders.map(funder => {
                        // Get report items based on funder id (funder.Id) and report.Funder_Report__c
                        const reportItems = utilities.reports.getFromFunderId(
                            funder.Id
                        );
                        return (
                            <ReportCard
                                key={funder.Id}
                                headline={_get(funder, 'Account__r.Name') || ''}
                                items={reportItems.map(item => ({
                                    id: item.Id,
                                    headline: labelTodo(item.Report_Type__c),
                                    dueDate: labelTodo(item.Due_Date__c),
                                }))}
                                disableCreate={
                                    funder.Account__c ===
                                    CONSTANTS.IDS.NNF_ACCOUNT
                                }
                                disableUpdate={
                                    funder.Account__c ===
                                    CONSTANTS.IDS.NNF_ACCOUNT
                                }
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
                    <p className="t-h5">{label('WizardEmptyStatesReports')}</p>
                )}
            </InputWrapper>
            <WizardModal
                isOpen={modalIsOpen}
                title={label('WizardModalHeadingReports')}
                onCancel={() => setModalIsOpen(false)}
                isSaving={!isDirty || modalIsSaving}
                onSave={mainForm.handleSubmit(submit)}>
                <InputWrapper>
                    <Select
                        name="Report_Type__c"
                        label={object.label('Initiative__c.Report_Type__c')}
                        subLabel={object.helpText(
                            'Initiative__c.Report_Type__c'
                        )}
                        placeholder={label('FormCaptureSelectEmpty')}
                        options={pickList(
                            'Initiative_Report__c.Report_Type__c'
                        )}
                        controller={mainForm.control}
                        required
                    />
                    <DatePicker
                        name="Due_Date__c"
                        label={object.label('Initiative__c.Due_Date__c')}
                        subLabel={object.helpText('Initiative__c.Due_Date__c')}
                        controller={mainForm.control}
                        required
                    />
                    <DateRange
                        name="ReportDates"
                        label={`${object.label(
                            'Initiative__c.Report_Period_Start_Date__c'
                        )} / ${object.label(
                            'Initiative__c.Report_Period_End_Date__c'
                        )}`}
                        controller={mainForm.control}
                    />
                </InputWrapper>
            </WizardModal>
        </>
    );
};

ReportScheduleComponent.propTypes = {};

ReportScheduleComponent.defaultProps = {};

ReportScheduleComponent.layout = 'wizard';

export default WithAuth(ReportScheduleComponent);
