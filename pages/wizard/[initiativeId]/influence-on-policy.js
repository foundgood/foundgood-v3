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
import { InputWrapper, Text, LongText } from 'components/_inputs';
import ListCard from 'components/_wizard/listCard';
import NoReflections from 'components/_wizard/noReflections';

const InfluenceOnPolicyComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Context for wizard pages
    const { MODE, CONTEXTS, UPDATE, REPORT_ID } = useContext();

    // Hook: Metadata
    const { labelTodo, label, helpText } = useMetadata();

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
        utilities,
        updateReportDetails,
        CONSTANTS,
    } = useInitiativeDataStore();

    // Store: Wizard navigation
    const { setCurrentSubmitHandler, currentItem } = useWizardNavigationStore();

    // Method: Adds founder to sf and updates founder list in view
    async function submit(formData) {
        try {
            const { Type_Of_Influence__c } = formData;

            // Object name
            const object = 'Initiative_Report_Detail__c';

            // Data for sf
            const data = {
                Type__c: CONSTANTS.TYPES.INFLUENCE_ON_POLICY,
                Type_Of_Influence__c,
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

            // Clear content in form
            reset();
        } catch (error) {
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
                Type__c: CONSTANTS.TYPES.INFLUENCE_ON_POLICY,
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

    // Local state to handle reflection
    const [reflecting, setReflecting] = useState(false);

    // We set an update id when updating and remove when adding
    const [updateId, setUpdateId] = useState(null);

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const { Type_Of_Influence__c } =
            initiative?._reportDetails[updateId] ?? {};

        setValue('Type_Of_Influence__c', Type_Of_Influence__c);
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
    const currentReportDetails = utilities
        .getReportDetails(REPORT_ID)
        .filter(item => item.Type__c === CONSTANTS.TYPES.INFLUENCE_ON_POLICY);

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
                                    'custom.FA_ReportWizardInfluencesReflectionSubHeading'
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
                    {label('custom.FA_ButtonAddInfluence')}
                </Button>
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={labelTodo('Add new influence on policy')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty}
                onSave={handleSubmit(submit)}>
                <InputWrapper>
                    <Text
                        name="Type_Of_Influence__c"
                        label={label(
                            'objects.initiativeReportDetail.Type_Of_Influence__c'
                        )}
                        subLabel={helpText(
                            'objects.initiativeReportDetail.Type_Of_Influence__c'
                        )}
                        placeholder={label(
                            'custom.FA_FormCaptureTextEntryEmpty'
                        )}
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
