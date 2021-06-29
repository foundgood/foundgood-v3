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
    useContext,
} from 'utilities/hooks';
import {
    useInitiativeDataStore,
    useWizardNavigationStore,
} from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import Button from 'components/button';
import Modal from 'components/modal';
import { InputWrapper, Select } from 'components/_inputs';
import EvaluationCard from 'components/_wizard/evaluationCard';
import NoReflections from 'components/_wizard/noReflections';

const InfluenceOnPolicyComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Context for wizard pages
    const { MODE, CONTEXTS, UPDATE, REPORT_ID } = useContext();

    // Hook: Metadata
    const { labelTodo, valueSet, label, helpText } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control, setValue, reset } = useForm();
    const {
        handleSubmit: handleSubmitReflections,
        control: controlReflections,
    } = useForm();
    const { isDirty } = useFormState({ control });

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

    // Store: Initiative data
    const {
        initiative,
        getReportDetails,
        updateReportDetails,
        CONSTANTS,
    } = useInitiativeDataStore();

    // Store: Wizard navigation
    const { setCurrentSubmitHandler, currentItem } = useWizardNavigationStore();

    // Method: Adds founder to sf and updates founder list in view
    async function submit(formData) {
        // Modal save button state
        setModalIsSaving(true);
        try {
            const { Who_Is_Evaluating__c } = formData;

            // Object name
            const object = 'Initiative_Report_Detail__c';

            // Data for sf
            const data = {
                Type__c: CONSTANTS.TYPES.EVALUATION,
                Who_Is_Evaluating__c,
            };

            // Update / Save
            const reportDetailId = updateId
                ? await sfUpdate({ object, data, id: updateId })
                : await sfCreate({
                      object,
                      data: { ...data, Initiative_Report__c: REPORT_ID },
                  });

            // Bulk update affected activity goals
            await updateReportDetails([reportDetailId]);

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
        // Reformat form data based on topic keys
        const reportDetails = Object.keys(initiative?._reportDetails)
            .reduce((acc, key) => {
                return [
                    ...acc,
                    {
                        reportDetailId: key,
                        value: formData[`${key}-reflection`],
                        selected: formData[`${key}-selector`],
                    },
                ];
            }, [])
            .filter(item => item.selected);

        // Object name
        const object = 'Initiative_Report_Detail__c';

        // Update report detail ids based on reformatted form data
        // Update always as the item is already a report detail item
        const reportDetailIds = await Promise.all(
            reportDetails.map(item =>
                sfUpdate({
                    object,
                    id: item.reportDetailId,
                    data: {
                        Description__c: item.value,
                    },
                })
            )
        );
        // Bulk update affected activity goals
        await updateReportDetails(reportDetailIds);
    }

    // Method: Submits no reflections flag
    async function submitNoReflections() {
        // Object name
        const object = 'Initiative_Report_Detail__c';

        // Create or update report detail ids based on reformatted form data
        // Update if reportDetailId exist in item - this means we have it already in the store
        const reportDetailId = await sfCreate({
            object,
            data: {
                Type__c: CONSTANTS.TYPES.EVALUATION,
                Description__c: CONSTANTS.CUSTOM.NO_REFLECTIONS,
                Initiative_Report__c: REPORT_ID,
            },
        });

        // Bulk update affected activity goals
        await updateReportDetails([reportDetailId]);
    }

    // Method: Form error/validation handler
    function error(error) {
        console.warn('Form invalid', error);
        throw error;
    }

    // Local state to handle modal
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsSaving, setModalIsSaving] = useState(false);

    // We set an update id when updating and remove when adding
    const [updateId, setUpdateId] = useState(null);

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const { Who_Is_Evaluating__c } =
            initiative?._reportDetails[updateId] ?? {};

        setValue('Who_Is_Evaluating__c', Who_Is_Evaluating__c);
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
    const currentReportDetails = getReportDetails(REPORT_ID).filter(
        item => item.Type__c === CONSTANTS.TYPES.EVALUATION
    );

    return (
        <>
            <TitlePreamble
                title={label(currentItem?.item?.labels?.form?.title)}
                preamble={label(currentItem?.item?.labels?.form?.preamble)}
                preload={!initiative.Id}
            />
            <InputWrapper preload={!initiative.Id}>
                {MODE === CONTEXTS.REPORT && (
                    <NoReflections
                        onClick={submitNoReflections}
                        show={
                            currentReportDetails.length === 0 ||
                            currentReportDetails.filter(
                                item =>
                                    item.Description__c &&
                                    item.Description__c !==
                                        CONSTANTS.CUSTOM.NO_REFLECTIONS
                            ).length < 1
                        }
                        submitted={
                            currentReportDetails.filter(
                                item =>
                                    item.Description__c ===
                                    CONSTANTS.CUSTOM.NO_REFLECTIONS
                            ).length > 0
                        }
                    />
                )}
                {currentReportDetails
                    .filter(
                        item =>
                            item.Description__c !==
                            CONSTANTS.CUSTOM.NO_REFLECTIONS
                    )
                    .map(item => {
                        return (
                            <EvaluationCard
                                key={item.Id}
                                evaluator={
                                    _get(item, 'Who_Is_Evaluating__c') || ''
                                }
                                action={() => {
                                    setUpdateId(item.Id);
                                    setModalIsOpen(true);
                                }}
                                controller={
                                    MODE === CONTEXTS.REPORT &&
                                    controlReflections
                                }
                                name={item.Id}
                                defaultValue={{
                                    selected:
                                        item?.Description__c !==
                                            CONSTANTS.CUSTOM.NO_REFLECTIONS ??
                                        false,
                                    value:
                                        item?.Description__c ===
                                        CONSTANTS.CUSTOM.NO_REFLECTIONS
                                            ? ''
                                            : item?.Description__c,
                                }}
                                inputLabel={label(
                                    'custom.FA_ReportWizardEvaluationsReflectionSubHeading'
                                )}
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
                    {label('custom.FA_ButtonAddEvaluation')}
                </Button>
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={label('custom.FA_WizardModalHeadingEvaluation')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty || modalIsSaving}
                onSave={handleSubmit(submit)}>
                <InputWrapper>
                    <Select
                        name="Who_Is_Evaluating__c"
                        label={label(
                            'objects.initiativeReportDetail.Who_Is_Evaluating__c'
                        )}
                        subLabel={helpText(
                            'objects.initiativeReportDetail.Who_Is_Evaluating__c'
                        )}
                        placeholder={label('custom.FA_FormCaptureSelectEmpty')}
                        options={valueSet(
                            'initiativeReportDetail.Who_Is_Evaluating__c'
                        )}
                        required
                        controller={control}
                    />
                </InputWrapper>
            </Modal>
        </>
    );
};

InfluenceOnPolicyComponent.propTypes = {};

InfluenceOnPolicyComponent.defaultProps = {};

InfluenceOnPolicyComponent.layout = 'wizard';

export default InfluenceOnPolicyComponent;
