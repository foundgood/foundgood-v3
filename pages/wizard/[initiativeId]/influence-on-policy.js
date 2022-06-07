// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import {
    useContext,
    useElseware,
    useLabels,
    useReflections,
    useWizardSubmit,
} from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import WithPermission from 'components/withPermission';
import TitlePreamble from 'components/_wizard/titlePreamble';
import Button from 'components/button';
import WizardModal from 'components/_modals/wizardModal';
import { InputWrapper, Text } from 'components/_inputs';
import ListCard from 'components/_wizard/listCard';
import NoReflections from 'components/_wizard/noReflections';

const InfluenceOnPolicyComponent = ({ pageProps }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { MODE, CONTEXTS, REPORT_ID } = useContext();
    const { label, object } = useLabels();
    const { ewCreateUpdateWrapper } = useElseware();
    const {
        submitNoReflection,
        submitMultipleReflectionsToSelf,
        getReflectionDefaultValue,
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

    const mainForm = useForm();
    const reflectionForm = useForm();
    const { isDirty } = useFormState({ control: mainForm.control });

    // ///////////////////
    // SUBMIT
    // ///////////////////

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
            mainForm.reset();
        } catch (error) {
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
    const currentReportDetails = utilities.reportDetails.getTypeInfluenceOnPolicyFromReportId(
        REPORT_ID
    );

    // ///////////////////
    // EFFECTS
    // ///////////////////

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const { Type_Of_Influence__c } = utilities.reportDetails.get(updateId);

        mainForm.setValue('Type_Of_Influence__c', Type_Of_Influence__c);
    }, [updateId, modalIsOpen]);

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <WithPermission context>
            <TitlePreamble />
            <InputWrapper>
                <Button
                    theme="teal"
                    className="self-start"
                    action={() => {
                        setUpdateId(null);
                        setModalIsOpen(true);
                    }}>
                    {label('ButtonAddInfluence')}
                </Button>
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
                    .map(reflection => (
                        <ListCard
                            key={reflection.Id}
                            headline={
                                _get(reflection, 'Type_Of_Influence__c') || ''
                            }
                            action={() => {
                                setUpdateId(reflection.Id);
                                setModalIsOpen(true);
                            }}
                            reflectAction={setReflecting}
                            controller={
                                MODE === CONTEXTS.REPORT &&
                                reflectionForm.control
                            }
                            name={reflection.Id}
                            defaultValue={getReflectionDefaultValue(reflection)}
                            inputLabel={label(
                                'ReportWizardInfluencesReflectionSubHeading'
                            )}
                        />
                    ))}
            </InputWrapper>
            <WizardModal
                isOpen={modalIsOpen}
                title={label('WizardModalHeadingInfluence')}
                onCancel={() => setModalIsOpen(false)}
                isSaving={!isDirty}
                onSave={mainForm.handleSubmit(submit)}>
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
                        controller={mainForm.control}
                        required
                    />
                </InputWrapper>
            </WizardModal>
        </WithPermission>
    );
};

InfluenceOnPolicyComponent.propTypes = {};

InfluenceOnPolicyComponent.defaultProps = {};

InfluenceOnPolicyComponent.layout = 'wizard';

export default WithAuth(InfluenceOnPolicyComponent);
