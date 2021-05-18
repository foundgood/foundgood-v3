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
    useContextMode,
} from 'utilities/hooks';
import {
    useInitiativeDataStore,
    useWizardNavigationStore,
} from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import Button from 'components/button';
import Modal from 'components/modal';
import { InputWrapper, SelectList, Text } from 'components/_inputs';
import ActivityCard from 'components/_wizard/activityCard';

const ActivitiesComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Context for wizard pages
    const { MODE, CONTEXTS, UPDATE, REPORT_ID } = useContextMode();

    // Hook: Metadata
    const { labelTodo, valueSet, controlledValueSet, log } = useMetadata();

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
        updateActivity,
        updateActivityGoals,
        updateReportDetails,
        CONSTANTS,
    } = useInitiativeDataStore();

    // Store: Wizard navigation
    const { setCurrentSubmitHandler } = useWizardNavigationStore();

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
            const { Things_To_Do__c, Activities, Location, Goals } = formData;

            // Object name
            const object = 'Initiative_Activity__c';

            // Data for sf
            const data = {
                Activity_Type__c: CONSTANTS.TYPES.ACTIVITY_INTERVENTION,
                Things_To_Do__c,
                Initiative_Location__c: Location[0]?.selectValue,
                Additional_Location_Information__c: Location[0]?.textValue,
                Activity_Tag__c: Activities.map(item => item.selectValue).join(
                    ';'
                ),
                KPI_Category__c: initiative?.Category__c,
            };

            // Update / Save
            const activityId = updateId
                ? await update(object, data, updateId)
                : await save(object, { ...data, Initiative__c: initiative.Id });

            // Update store
            await updateActivity(activityId);

            // Create Initiative activitie goals based on goal
            const activityGoalIds = await Promise.all(
                Goals.map(item => {
                    return sfCreate({
                        object: 'Initiative_Activity_Goal__c',
                        data: {
                            Initiative_Goal__c: item.selectValue,
                            Initiative_Activity__c: activityId,
                        },
                    });
                })
            );

            // Bulk update affected activity goals
            await updateActivityGoals(activityGoalIds);

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
        const reportDetails = Object.keys(initiative?._activities)
            .reduce((acc, key) => {
                // Does the reflection relation exist already?
                const currentReflection = currentReportDetails.filter(
                    item => item.Initiative_Activity__c === key
                );
                return [
                    ...acc,
                    {
                        reportDetailId: currentReflection[0]?.Id ?? false,
                        relationId: key,
                        value: formData[`${key}-reflection`],
                        selected: formData[`${key}-selector`],
                    },
                ];
            }, [])
            .filter(item => item.selected);

        // Object name
        const object = 'Initiative_Report_Detail__c';

        // Create or update report detail ids based on reformatted form data
        // Update if reportDetailId exist in item - this means we have it already in the store
        const reportDetailIds = await Promise.all(
            reportDetails.map(item =>
                item.reportDetailId
                    ? sfUpdate({
                          object,
                          id: item.reportDetailId,
                          data: {
                              Description__c: item.value,
                          },
                      })
                    : sfCreate({
                          object,
                          data: {
                              Initiative_Activity__c: item.relationId,
                              Description__c: item.value,
                              Initiative_Report__c: REPORT_ID,
                          },
                      })
            )
        );

        // Bulk update affected activity goals
        await updateReportDetails(reportDetailIds);
    }

    // Method: Form error/validation handler
    function error(error) {
        console.warn('Form invalid', error);
        throw error;
    }

    // Local state to handle modal
    const [modalIsOpen, setModalIsOpen] = useState(false);

    // We set an update id when updating and remove when adding
    const [updateId, setUpdateId] = useState(null);

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const {
            Id,
            Things_To_Do__c,
            Activity_Tag__c,
            Initiative_Location__c,
            Additional_Location_Information__c,
        } = initiative?._activities[updateId] ?? {};

        setValue('Things_To_Do__c', Things_To_Do__c);
        setValue('Location', [
            {
                selectValue: Initiative_Location__c,
                textValue: Additional_Location_Information__c,
            },
        ]);

        setValue(
            'Activities',
            Activity_Tag__c?.split(';').map(value => ({
                selectValue: value,
            }))
        );

        setValue(
            'Goals',
            Object.values(initiative?._activityGoals)
                .filter(item => item.Initiative_Activity__c === Id)
                .map(activityGoal => ({
                    selectValue: activityGoal.Initiative_Goal__c,
                }))
        );
    }, [updateId, modalIsOpen]);

    // Add submit handler to wizard navigation store
    useEffect(() => {
        setTimeout(() => {
            setCurrentSubmitHandler(
                handleSubmitReflections(submitReflections, error)
            );
        }, 10);
    }, []);

    // Current report details
    const [currentReportDetails] = useState(getReportDetails(REPORT_ID));

    return (
        <>
            <TitlePreamble
                title={labelTodo('Outline your activities')}
                preamble={labelTodo('Preamble')}
            />
            <InputWrapper>
                {Object.keys(initiative?._activities)
                    .filter(activityKey => {
                        const activity = initiative?._activities[activityKey];
                        return (
                            activity.Activity_Type__c ===
                            CONSTANTS.TYPES.ACTIVITY_INTERVENTION
                        );
                    })
                    .map(activityKey => {
                        const activity = initiative?._activities[activityKey];

                        const headline =
                            _get(activity, 'Things_To_Do__c') || '';

                        const tagsString = activity?.Activity_Tag__c ?? null;
                        const tags = tagsString ? tagsString.split(';') : [];

                        const goals = Object.values(initiative?._activityGoals)
                            .filter(
                                item =>
                                    item.Initiative_Activity__c === activity.Id
                            )
                            .map(
                                activityGoal =>
                                    activityGoal.Initiative_Goal__r.Goal__c
                            );

                        const reflection = currentReportDetails.filter(
                            item => item.Initiative_Activity__c === activityKey
                        );

                        return (
                            <ActivityCard
                                key={activityKey}
                                headline={headline}
                                tags={tags}
                                goals={goals}
                                action={() => {
                                    setUpdateId(activityKey);
                                    setModalIsOpen(true);
                                }}
                                controller={
                                    MODE === CONTEXTS.REPORT &&
                                    controlReflections
                                }
                                name={activityKey}
                                defaultValue={{
                                    selected:
                                        reflection[0] ?? false ? true : false,
                                    value: reflection[0]?.Description__c ?? '',
                                }}
                                inputLabel={labelTodo(
                                    'Outline your reflection'
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
                    {labelTodo('Add activity')}
                </Button>
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={labelTodo('Add new activity')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty}
                onSave={handleSubmit(submit)}>
                <InputWrapper>
                    <Text
                        name="Things_To_Do__c"
                        label={labelTodo('Activity name')}
                        placeholder={labelTodo('Enter name')}
                        maxLength={200}
                        controller={control}
                        required
                    />
                    <SelectList
                        name="Activities"
                        label={labelTodo('Activity tag')}
                        selectPlaceholder={labelTodo('Please select')}
                        options={controlledValueSet(
                            'initiativeActivity.Activity_Tag__c',
                            initiative?.Category__c
                        )}
                        listMaxLength={4}
                        controller={control}
                    />

                    <SelectList
                        name="Location"
                        label={labelTodo('Where is it located?')}
                        listMaxLength={1}
                        options={valueSet(
                            'initiativeActivity.Initiative_Location__c'
                        )}
                        showText
                        selectPlaceholder={labelTodo('Please select')}
                        selectLabel={labelTodo('Country')}
                        textLabel={labelTodo('Region')}
                        controller={control}
                    />

                    {Object.keys(initiative?._goals).length > 0 && (
                        <SelectList
                            name="Goals"
                            label={labelTodo('Link to one of your goals')}
                            listMaxLength={1}
                            options={Object.keys(initiative?._goals).map(
                                goalKey => {
                                    const goal = initiative?._goals[goalKey];
                                    return {
                                        value: goal.Id,
                                        label: goal.Goal__c,
                                    };
                                }
                            )}
                            selectPlaceholder={labelTodo('Please select')}
                            controller={control}
                        />
                    )}
                </InputWrapper>
            </Modal>
        </>
    );
};

ActivitiesComponent.propTypes = {};

ActivitiesComponent.defaultProps = {};

ActivitiesComponent.layout = 'wizard';

export default ActivitiesComponent;
