// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import { useAuth, useMetadata, useElseware } from 'utilities/hooks';
import {
    useInitiativeDataStore,
    useWizardNavigationStore,
} from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import Button from 'components/button';
import Modal from 'components/modal';
import { InputWrapper, LongText } from 'components/_inputs';
import GoalCard from 'components/_wizard/goalCard';

const GoalsComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { label, helpText } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control, setValue, reset } = useForm();
    const { isDirty } = useFormState({ control });

    // Hook: Elseware setup
    const { ewCreateUpdateWrapper } = useElseware();

    // Store: Wizard navigation
    const { currentItem, setCurrentSubmitHandler } = useWizardNavigationStore();

    // Store: Initiative data
    const { initiative, CONSTANTS } = useInitiativeDataStore();

    // Method: Adds founder to sf and updates founder list in view
    async function submit(formData) {
        // Modal save button state
        setModalIsSaving(true);
        try {
            const { Goal__c } = formData;

            // Data for sf
            // Get type of submission based on goalType
            const data = {
                Type__c: CONSTANTS.TYPES.GOAL_CUSTOM,
                Goal__c,
                KPI_Category__c: initiative?.Category__c,
            };

            // Update / Save
            await ewCreateUpdateWrapper(
                'initiative-goal/initiative-goal',
                updateId,
                data,
                { Initiative__c: initiative.Id },
                '_goals'
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

    // Local state to handle modal
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsSaving, setModalIsSaving] = useState(false);

    // We set an update id when updating and remove when adding
    const [updateId, setUpdateId] = useState(null);

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const { Goal__c } = initiative?._goals[updateId] ?? {};
        setValue('Goal__c', Goal__c);
    }, [updateId, modalIsOpen]);

    // Reset submithandler
    useEffect(() => {
        setTimeout(() => {
            setCurrentSubmitHandler(null);
        }, 100);
    }, [initiative]);

    return (
        <>
            <TitlePreamble
                title={label(currentItem?.item?.labels?.form?.title)}
                preamble={label(currentItem?.item?.labels?.form?.preamble)}
                preload={!initiative.Id}
            />
            <InputWrapper preload={!initiative.Id}>
                {Object.keys(initiative?._goals).map(goalKey => {
                    const goal = initiative?._goals[goalKey];
                    return goal.Type__c === CONSTANTS.TYPES.GOAL_CUSTOM ? (
                        <GoalCard
                            key={goalKey}
                            headline={_get(goal, 'Goal__c') || ''}
                            footnote={_get(goal, 'Type__c') || ''}
                            action={() => {
                                setUpdateId(goalKey);
                                setModalIsOpen(true);
                            }}
                        />
                    ) : null;
                })}
                <Button
                    theme="teal"
                    className="self-start"
                    action={() => {
                        setUpdateId(null);
                        setModalIsOpen(true);
                    }}>
                    {label('custom.FA_ButtonAddGoal')}
                </Button>
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={label('custom.FA_WizardModalHeadingGoals')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty || modalIsSaving}
                onSave={handleSubmit(submit)}>
                <InputWrapper>
                    <LongText
                        name="Goal__c"
                        label={label('objects.initiativeGoal.Goal__c')}
                        subLabel={helpText('objects.initiativeGoal.Goal__c')}
                        placeholder={label(
                            'custom.FA_FormCaptureTextEntryEmpty'
                        )}
                        maxLength={200}
                        controller={control}
                    />
                </InputWrapper>
            </Modal>
        </>
    );
};

GoalsComponent.propTypes = {};

GoalsComponent.defaultProps = {};

GoalsComponent.layout = 'wizard';

export default GoalsComponent;
