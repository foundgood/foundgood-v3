// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import {
    useAuth,
    useLabels,
    useElseware,
    useReflections,
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
import { InputWrapper, Text } from 'components/_inputs';
import ListCard from 'components/_wizard/listCard';
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

    const { initiative, utilities, CONSTANTS } = useInitiativeDataStore();
    const { setCurrentSubmitHandler } = useWizardNavigationStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { MODE, CONTEXTS, REPORT_ID } = useContext();
    const { label, object } = useLabels();
    const { ewCreateUpdateWrapper } = useElseware();
    const {
        submitNoReflection,
        submitMultipleReflectionsToSelf,
    } = useReflections({
        dataSet() {
            return utilities.reportDetails.getTypeInfluenceOnPolicy;
        },
        type: CONSTANTS.REPORT_DETAILS.INFLUENCE_ON_POLICY,
    });

    // ///////////////////
    // STATE
    // ///////////////////

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [reflecting, setReflecting] = useState(false);
    const [updateId, setUpdateId] = useState(null);

    // ///////////////////
    // FORMS
    // ///////////////////

    const { handleSubmit, control, setValue, reset } = useForm();
    const {
        handleSubmit: handleSubmitReflections,
        control: controlReflections,
    } = useForm();
    const { isDirty } = useFormState({ control });

    // ///////////////////
    // METHODS
    // ///////////////////

    // Method: Adds founder to sf and updates founder list in view
    async function submit(formData) {
        try {
            const { Type_Of_Influence__c } = formData;

            // Data for sf
            const data = {
                Type__c: CONSTANTS.REPORT_DETAILS.INFLUENCE_ON_POLICY,
                Type_Of_Influence__c,
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

            // Clear content in form
            reset();
        } catch (error) {
            console.warn(error);
        }
    }

    // Method: Form error/validation handler
    function error(error) {
        console.warn('Form invalid', error);
        throw error;
    }

    // ///////////////////
    // EFFECTS
    // ///////////////////

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const { Type_Of_Influence__c } = utilities.reportDetails.get(updateId);

        setValue('Type_Of_Influence__c', Type_Of_Influence__c);
    }, [updateId, modalIsOpen]);

    // Add submit handler to wizard navigation store
    useEffect(() => {
        setTimeout(() => {
            setCurrentSubmitHandler(
                MODE === CONTEXTS.REPORT
                    ? handleSubmitReflections(
                          submitMultipleReflectionsToSelf,
                          error
                      )
                    : null
            );
        }, 100);
    }, [initiative]);

    // ///////////////////
    // DATA
    // ///////////////////

    // Current report details
    const currentReportDetails = utilities.reportDetails.getTypeInfluenceOnPolicyFromReportId(
        REPORT_ID
    );

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
                            <ListCard
                                key={item.Id}
                                headline={
                                    _get(item, 'Type_Of_Influence__c') || ''
                                }
                                action={() => {
                                    setUpdateId(item.Id);
                                    setModalIsOpen(true);
                                }}
                                reflectAction={setReflecting}
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
                                    'ReportWizardInfluencesReflectionSubHeading'
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
                    {label('ButtonAddInfluence')}
                </Button>
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={label('WizardModalHeadingInfluence')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty}
                onSave={handleSubmit(submit)}>
                <InputWrapper>
                    <Text
                        name="Type_Of_Influence__c"
                        label={object.label(
                            'Initiative_Report_Detail__c.Type_Of_Influence__c'
                        )}
                        subLabel={object.helpText(
                            'Initiative_Report_Detail__c.Type_Of_Influence__c'
                        )}
                        placeholder={label('FormCaptureTextEntryEmpty')}
                        maxLength={80}
                        controller={control}
                        required
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
