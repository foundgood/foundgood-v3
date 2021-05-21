// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState, useWatch } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import { useAuth, useMetadata, useSalesForce } from 'utilities/hooks';
import {
    useInitiativeDataStore,
    useWizardNavigationStore,
} from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import Button from 'components/button';
import Modal from 'components/modal';
import { InputWrapper, Select, LongText } from 'components/_inputs';
import GoalCard from 'components/_wizard/goalCard';

const GoalsComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const {
        labelTodo,
        label,
        valueSet,
        log,
        helpText,
        controlledValueSet,
    } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control, setValue, reset } = useForm();
    const { isDirty } = useFormState({ control });
    const goalTypeSelect = useWatch({ control, name: 'Type__c' });

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

    // Store: Wizard navigation
    const { currentItem } = useWizardNavigationStore();

    // Store: Initiative data
    const { initiative, updateGoal, CONSTANTS } = useInitiativeDataStore();

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
            const { Type__c, Goal__c, Funder_Objective__c } = formData;

            // Object name
            const object = 'Initiative_Goal__c';

            // Data for sf
            // Get type of submission based on goalType
            const data = {
                [CONSTANTS.TYPES.GOAL_CUSTOM]: {
                    Type__c,
                    Goal__c,
                    Funder_Objective__c: '',
                    KPI_Category__c: initiative?.Category__c,
                },
                [CONSTANTS.TYPES.GOAL_PREDEFINED]: {
                    Goal__c: Funder_Objective__c,
                    Type__c,
                    Funder_Objective__c,
                    KPI_Category__c: initiative?.Category__c,
                },
            };

            // Update / Save
            const goalId = updateId
                ? await update(object, data[goalType], updateId)
                : await save(object, {
                      ...data[goalType],
                      Initiative__c: initiative.Id,
                  });

            // Update store
            await updateGoal(goalId);

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
    const [goalType, setGoalType] = useState(null);

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const { Type__c, Goal__c, Funder_Objective__c } =
            initiative?._goals[updateId] ?? {};

        setValue('Type__c', Type__c);
        setValue('Goal__c', Goal__c);
        setValue('Funder_Objective__c', Funder_Objective__c);

        // Set goal type
        setGoalType(Type__c);
    }, [updateId, modalIsOpen]);

    // Watch the change of goal type
    useEffect(() => {
        setGoalType(goalTypeSelect);
    }, [goalTypeSelect]);

    return (
        <>
            <TitlePreamble
                title={label(currentItem?.item?.labels?.form?.title)}
                preamble={label(currentItem?.item?.labels?.form?.preamble)}
            />
            <InputWrapper>
                {Object.keys(initiative?._goals).map(goalKey => {
                    const goal = initiative?._goals[goalKey];
                    return (
                        <GoalCard
                            key={goalKey}
                            headline={
                                goal.Type__c === CONSTANTS.TYPES.GOAL_CUSTOM
                                    ? _get(goal, 'Goal__c') || ''
                                    : _get(goal, 'Funder_Objective__c') || ''
                            }
                            footnote={_get(goal, 'Type__c') || ''}
                            action={() => {
                                setUpdateId(goalKey);
                                setModalIsOpen(true);
                            }}
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
                    {label('custom.FA_ButtonAddGoal')}
                </Button>
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={labelTodo('Add new goal')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty}
                onSave={handleSubmit(submit)}>
                <InputWrapper>
                    <Select
                        name="Type__c"
                        label={label('objects.initiativeGoal.Type__c')}
                        subLabel={helpText('objects.initiativeGoal.Type__c')}
                        placeholder={labelTodo('SELECT_PLACEHOLDER')}
                        options={valueSet('initiativeGoal.Type__c')}
                        controller={control}
                        required
                    />

                    {/* Custom goal */}
                    {goalType === CONSTANTS.TYPES.GOAL_CUSTOM && (
                        <LongText
                            name="Goal__c"
                            label={label('objects.initiativeGoal.Goal__c')}
                            subLabel={helpText(
                                'objects.initiativeGoal.Goal__c'
                            )}
                            placeholder={labelTodo('TEXT_PLACEHOLDER')}
                            maxLength={200}
                            controller={control}
                        />
                    )}

                    {/* Predefined goal */}
                    {/* If not any predefined goals show them all (controlled valueset) */}
                    {goalType === CONSTANTS.TYPES.GOAL_PREDEFINED && (
                        <Select
                            name="Funder_Objective__c"
                            label={label(
                                'objects.initiativeGoal.Funder_Objective__c'
                            )}
                            subLabel={helpText(
                                'objects.initiativeGoal.Funder_Objective__c'
                            )}
                            placeholder={labelTodo('SELECT_PLACEHOLDER')}
                            options={controlledValueSet(
                                'initiativeGoal.Funder_Objective__c',
                                initiative?.Category__c
                            )}
                            controller={control}
                        />
                    )}
                </InputWrapper>
            </Modal>
        </>
    );
};

GoalsComponent.propTypes = {};

GoalsComponent.defaultProps = {};

GoalsComponent.layout = 'wizard';

export default GoalsComponent;
