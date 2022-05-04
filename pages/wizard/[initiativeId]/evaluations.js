// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
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
import { InputWrapper, Select } from 'components/_inputs';
import EvaluationCard from 'components/_wizard/evaluationCard';
import NoReflections from 'components/_wizard/noReflections';

const InfluenceOnPolicyComponent = ({ pageProps }) => {
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
    const { label, object, pickList } = useLabels();
    const { ewCreateUpdateWrapper } = useElseware();
    const {
        submitNoReflection,
        submitMultipleReflectionsToSelf,
    } = useReflections({
        dataSet() {
            return utilities.reportDetails.getTypeEvaluation;
        },
        type: CONSTANTS.REPORT_DETAILS.EVALUATION,
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

    // Hook: useForm setup
    const mainForm = useForm();
    const reflectionForm = useForm();
    const { isDirty } = useFormState({ control: mainForm.control });

    // ///////////////////
    // SUBMIT
    // ///////////////////

    async function submit(formData) {
        // Modal save button state
        setModalIsSaving(true);
        try {
            const { Who_Is_Evaluating__c } = formData;

            // Data for sf
            const data = {
                Type__c: CONSTANTS.REPORT_DETAILS.EVALUATION,
                Who_Is_Evaluating__c,
            };

            // Update / Save
            await ewCreateUpdateWrapper(
                'initiative-report-detail/initiative-report-detail',
                updateId,
                data,
                { Initiative_Report__c: REPORT_ID },
                '_reportDetails'
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
        [CONTEXTS.REPORT]: [reflectionForm, submitMultipleReflectionsToSelf],
    });

    // ///////////////////
    // DATA
    // ///////////////////

    // Current report details
    const currentReportDetails = utilities.reportDetails.getTypeEvaluationFromReportId(
        REPORT_ID
    );

    // ///////////////////
    // EFFECTS
    // ///////////////////

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const { Who_Is_Evaluating__c } = utilities.reportDetails.get(updateId);

        mainForm.setValue('Who_Is_Evaluating__c', Who_Is_Evaluating__c);
    }, [updateId, modalIsOpen]);

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <>
            <TitlePreamble />
            <InputWrapper>
                {MODE === CONTEXTS.REPORT && (
                    <NoReflections
                        onClick={submitNoReflection}
                        reflectionItems={currentReportDetails.map(
                            item => item.Description__c
                        )}
                        reflecting={reflecting}
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
                                reflectAction={setReflecting}
                                controller={
                                    MODE === CONTEXTS.REPORT &&
                                    reflectionForm.control
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
                                    'ReportWizardEvaluationsReflectionSubHeading'
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
                    {label('ButtonAddEvaluation')}
                </Button>
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={label('WizardModalHeadingEvaluation')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty || modalIsSaving}
                onSave={mainForm.handleSubmit(submit)}>
                <InputWrapper>
                    <Select
                        name="Who_Is_Evaluating__c"
                        label={object.label(
                            'Initiative_Report_Detail__c.Who_Is_Evaluating__c'
                        )}
                        subLabel={object.helpText(
                            'Initiative_Report_Detail__c.Who_Is_Evaluating__c'
                        )}
                        placeholder={label('FormCaptureSelectEmpty')}
                        options={pickList(
                            'Initiative_Report_Detail__c.Who_Is_Evaluating__c'
                        )}
                        required
                        controller={mainForm.control}
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
