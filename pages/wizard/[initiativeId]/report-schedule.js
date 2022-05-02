// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import { useAuth, useLabels, useElseware } from 'utilities/hooks';
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
    // ///////////////////
    // ///////////////////
    // AUTH
    // ///////////////////

    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // ///////////////////
    // ///////////////////
    // STORES
    // ///////////////////

    const { initiative, utilities, CONSTANTS } = useInitiativeDataStore();
    const { currentItem, setCurrentSubmitHandler } = useWizardNavigationStore();

    // ///////////////////
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { labelTodo, label, object, valueSet } = useLabels();
    const { ewCreateUpdateWrapper } = useElseware();

    // ///////////////////
    // ///////////////////
    // STATE
    // ///////////////////

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsSaving, setModalIsSaving] = useState(false);
    const [updateId, setUpdateId] = useState(null);
    const [funder, setFunder] = useState(null);

    // ///////////////////
    // ///////////////////
    // FORMS
    // ///////////////////

    const { handleSubmit, control, setValue, reset } = useForm();
    const { isDirty } = useFormState({ control });

    // ///////////////////
    // ///////////////////
    // METHODS
    // ///////////////////

    // Method: Adds founder to sf and updates founder list in view
    async function submit(formData) {
        // Modal save button state
        setModalIsSaving(true);
        try {
            const { ReportDates, Report_Type__c, Due_Date__c } = formData;

            // Data for sf
            const data = {
                Name: `${initiative.Id} - ${funder.Account__r.Name} - ${Report_Type__c} ${Due_Date__c}`,
                Report_Period_Start_Date__c: ReportDates.from,
                Report_Period_End_Date__c: ReportDates.to,
                Report_Type__c,
                Due_Date__c,
                Status__c: CONSTANTS.TYPES.REPORT_NOT_STARTED,
                Funder_Report__c: funder.Id,
            };

            // Update / Save
            await ewCreateUpdateWrapper(
                'initiative-report/initiative-report',
                updateId,
                data,
                { Initiative__c: initiative.Id },
                '_activities'
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

    // ///////////////////
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

        setValue('Report_Type__c', Report_Type__c);
        setValue('Due_Date__c', Due_Date__c);
        setValue('ReportDates', {
            from: Report_Period_Start_Date__c,
            to: Report_Period_End_Date__c,
        });
    }, [updateId, modalIsOpen]);

    // Reset submithandler
    useEffect(() => {
        setTimeout(() => {
            setCurrentSubmitHandler(null);
        }, 100);
    }, [initiative]);

    // ///////////////////
    // ///////////////////
    // DATA
    // ///////////////////

    // Funders
    const funders = utilities.funders.getAll();

    return (
        <>
            <TitlePreamble
                title={label(currentItem?.item?.labels?.form?.title)}
                preamble={label(currentItem?.item?.labels?.form?.preamble)}
                preload={!initiative.Id}
            />
            <InputWrapper preload={!initiative.Id}>
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
            <Modal
                isOpen={modalIsOpen}
                title={label('WizardModalHeadingReports')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty || modalIsSaving}
                onSave={handleSubmit(submit)}>
                <InputWrapper>
                    <Select
                        name="Report_Type__c"
                        label={object.label('Initiative__c.Report_Type__c')}
                        subLabel={object.helpText(
                            'Initiative__c.Report_Type__c'
                        )}
                        placeholder={label('FormCaptureSelectEmpty')}
                        options={valueSet('initiativeReport.Report_Type__c')}
                        controller={control}
                        required
                    />
                    <DatePicker
                        name="Due_Date__c"
                        label={object.label('Initiative__c.Due_Date__c')}
                        subLabel={object.helpText('Initiative__c.Due_Date__c')}
                        controller={control}
                        required
                    />
                    <DateRange
                        name="ReportDates"
                        label={`${object.label(
                            'Initiative__c.Report_Period_Start_Date__c'
                        )} / ${object.label(
                            'Initiative__c.Report_Period_End_Date__c'
                        )}`}
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
