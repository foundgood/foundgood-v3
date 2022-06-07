// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';

// Utilities
import { useElseware, useLabels, useWizardSubmit } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import WithPermission from 'components/withPermission';
import TitlePreamble from 'components/_wizard/titlePreamble';
import Button from 'components/button';
import WizardModal from 'components/_modals/wizardModal';
import { InputWrapper, LongText } from 'components/_inputs';
import GoalCard from 'components/_wizard/goalCard';

const GoalsComponent = ({ pageProps }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label, object } = useLabels();
    const { ewCreateUpdateWrapper } = useElseware();

    // ///////////////////
    // STATE
    // ///////////////////

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsSaving, setModalIsSaving] = useState(false);
    const [updateId, setUpdateId] = useState(null);

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
            const { Goal__c } = formData;

            // Data for sf
            // Get type of submission based on goalType
            const data = {
                Type__c: CONSTANTS.GOALS.GOAL_CUSTOM,
                Goal__c,
                KPI_Category__c: utilities.initiative.get().Category__c,
            };

            // Update / Save
            await ewCreateUpdateWrapper(
                'initiative-goal/initiative-goal',
                updateId,
                data,
                { Initiative__c: utilities.initiative.get().Id },
                '_goals'
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
    // EFFECTS
    // ///////////////////

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const { Goal__c } = utilities.goals.get(updateId);
        mainForm.setValue('Goal__c', Goal__c);
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
                    {label('ButtonAddGoal')}
                </Button>
                {utilities.goals.getTypeCustom().map(goal => (
                    <GoalCard
                        key={goal.Id}
                        headline={goal?.Goal__c ?? ''}
                        action={() => {
                            setUpdateId(goal.Id);
                            setModalIsOpen(true);
                        }}
                    />
                ))}
            </InputWrapper>
            <WizardModal
                isOpen={modalIsOpen}
                title={label('WizardModalHeadingGoals')}
                onCancel={() => setModalIsOpen(false)}
                isSaving={modalIsSaving}
                onSave={mainForm.handleSubmit(submit)}>
                <InputWrapper>
                    <LongText
                        name="Goal__c"
                        label={object.label('Initiative_Goal__c.Goal__c')}
                        subLabel={object.helpText('Initiative_Goal__c.Goal__c')}
                        placeholder={label('FormCaptureTextEntryEmpty')}
                        maxLength={200}
                        controller={mainForm.control}
                    />
                </InputWrapper>
            </WizardModal>
        </WithPermission>
    );
};

GoalsComponent.propTypes = {};

GoalsComponent.defaultProps = {};

GoalsComponent.layout = 'wizard';

export default WithAuth(GoalsComponent);
