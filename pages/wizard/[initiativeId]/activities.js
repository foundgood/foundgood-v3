// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import { useAuth, useMetadata, useElseware, useContext } from 'utilities/hooks';
import {
    useInitiativeDataStore,
    useWizardNavigationStore,
} from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import Button from 'components/button';
import Modal from 'components/modal';
import { InputWrapper, SelectList, Text, LongText } from 'components/_inputs';
import ActivityCard from 'components/_wizard/activityCard';
import NoReflections from 'components/_wizard/noReflections';

const ActivitiesComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Context for wizard pages
    const { MODE, CONTEXTS, REPORT_ID } = useContext();

    // Hook: Metadata
    const { label, valueSet, controlledValueSet, helpText } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control, setValue, reset } = useForm();
    const {
        handleSubmit: handleSubmitReflections,
        control: controlReflections,
        setValue: setValueReflections,
    } = useForm();
    const { isDirty } = useFormState({ control });

    // Hook: Salesforce setup
    const { ewUpdate, ewCreate } = useElseware();

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
        // Modal save button state
        setModalIsSaving(true);
        try {
            const {
                Things_To_Do__c,
                Things_To_Do_Description__c,
                Activities,
                Location,
                Goals,
            } = formData;

            // Data for sf
            const data = {
                Activity_Type__c: CONSTANTS.TYPES.ACTIVITY_INTERVENTION,
                Things_To_Do__c,
                Things_To_Do_Description__c,
                Initiative_Location__c: Location[0]?.selectValue,
                Additional_Location_Information__c: Location[0]?.textValue,
                Activity_Tag__c: Activities.map(item => item.selectValue).join(
                    ';'
                ),
                KPI_Category__c: initiative?.Category__c,
                _activityGoals: Goals.map(item => item.selectValue),
            };

            // Update / save (custom)
            const { data: activityData } = updateId
                ? await ewUpdate(
                      'initiative-activity/initiative-activity-intervention',
                      updateId,
                      data
                  )
                : await ewCreate(
                      'initiative-activity/initiative-activity-intervention',
                      {
                          ...data,
                          Initiative__c: initiative.Id,
                      }
                  );

            // Destructure response
            const { _activityGoals, ...rest } = activityData;

            // Clean out existing related data
            utilities.removeInitiativeDataRelations(
                '_activityGoals',
                item => item.Initiative_Activity__c === updateId
            );

            // Update main data
            utilities.updateInitiativeData('_activities', rest);

            // Updated related data
            utilities.updateInitiativeDataRelations(
                '_activityGoals',
                _activityGoals
            );

            // Close modal
            setModalIsOpen(false);

            // Modal save button state
            setModalIsSaving(false);

            // Clear content in form
            reset();

            // Fold out shit when done if report
            // setValue: setValueReflections,
            setTimeout(() => {
                if (MODE === CONTEXTS.REPORT) {
                    setValueReflections(`${activityData.Id}-selector`, true);
                }
            }, 500);
        } catch (error) {
            // Modal save button state
            setModalIsSaving(false);
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
                              Type__c: CONSTANTS.TYPES.ACTIVITY_OVERVIEW,
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

    // Method: Submits no reflections flag
    async function submitNoReflections() {
        // Object name
        const object = 'Initiative_Report_Detail__c';

        // Create or update report detail ids based on reformatted form data
        // Update if reportDetailId exist in item - this means we have it already in the store
        const reportDetailIds = await Promise.all(
            Object.values(initiative?._activities)
                .filter(
                    item =>
                        item.Activity_Type__c ===
                        CONSTANTS.TYPES.ACTIVITY_INTERVENTION
                )
                .map(activity =>
                    sfCreate({
                        object,
                        data: {
                            Type__c: CONSTANTS.TYPES.ACTIVITY_OVERVIEW,
                            Initiative_Activity__c: activity.Id,
                            Description__c: CONSTANTS.CUSTOM.NO_REFLECTIONS,
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
    const [modalIsSaving, setModalIsSaving] = useState(false);

    // Local state to handle reflection
    const [reflecting, setReflecting] = useState(false);

    // We set an update id when updating and remove when adding
    const [updateId, setUpdateId] = useState(null);

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const {
            Id,
            Things_To_Do__c,
            Things_To_Do_Description__c,
            Activity_Tag__c,
            Initiative_Location__c,
            Additional_Location_Information__c,
        } = initiative?._activities[updateId] ?? {};

        setValue('Things_To_Do_Description__c', Things_To_Do_Description__c);
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
    const currentReportDetails = utilities.getReportDetails(REPORT_ID);

    // Custom goals
    const customGoals = Object.values(initiative?._goals).filter(
        goal => goal.Type__c === CONSTANTS.TYPES.GOAL_CUSTOM
    );

    // Check if there is relevant report details yet
    const reportDetailsItems = currentReportDetails
        .filter(item =>
            Object.keys(initiative?._activities).includes(
                item.Initiative_Activity__c
            )
        )
        .filter(item => {
            // Activity
            const activity =
                initiative?._activities[item.Initiative_Activity__c];
            return (
                activity.Activity_Type__c ===
                CONSTANTS.TYPES.ACTIVITY_INTERVENTION
            );
        });

    return (
        <>
            <TitlePreamble
                title={label(currentItem?.item?.labels?.form?.title)}
                preamble={label(currentItem?.item?.labels?.form?.preamble)}
                preload={!initiative.Id}
            />
            <InputWrapper preload={!initiative.Id}>
                {MODE === CONTEXTS.REPORT &&
                    Object.values(initiative._activities).filter(
                        activity =>
                            activity.Activity_Type__c ===
                            CONSTANTS.TYPES.ACTIVITY_INTERVENTION
                    ).length > 0 && (
                        <NoReflections
                            onClick={submitNoReflections}
                            reflectionItems={reportDetailsItems.map(
                                item => item.Description__c
                            )}
                            reflecting={reflecting}
                        />
                    )}
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

                        const description =
                            _get(activity, 'Things_To_Do_Description__c') || '';

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
                                description={description}
                                tags={tags}
                                goals={goals}
                                action={() => {
                                    setUpdateId(activityKey);
                                    setModalIsOpen(true);
                                }}
                                reflectAction={setReflecting}
                                controller={
                                    MODE === CONTEXTS.REPORT &&
                                    controlReflections
                                }
                                name={activityKey}
                                defaultValue={{
                                    selected:
                                        reflection[0] &&
                                        (reflection[0]?.Description__c !==
                                            CONSTANTS.CUSTOM.NO_REFLECTIONS ??
                                            false),
                                    value:
                                        reflection[0]?.Description__c ===
                                        CONSTANTS.CUSTOM.NO_REFLECTIONS
                                            ? ''
                                            : reflection[0]?.Description__c,
                                }}
                                inputLabel={label(
                                    'custom.FA_ReportWizardActivitiesReflectionSubHeading'
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
                    {label('custom.FA_ButtonAddActivity')}
                </Button>
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={label('custom.FA_WizardModalHeadingActivities')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty || modalIsSaving}
                onSave={handleSubmit(submit)}>
                <InputWrapper>
                    <Text
                        name="Things_To_Do__c"
                        label={label(
                            'objects.initiativeActivity.Things_To_Do__c'
                        )}
                        subLabel={helpText(
                            'objects.initiativeActivity.Things_To_Do__c'
                        )}
                        placeholder={label(
                            'custom.FA_FormCaptureTextEntryEmpty'
                        )}
                        maxLength={200}
                        controller={control}
                        required
                    />
                    <LongText
                        name="Things_To_Do_Description__c"
                        label={label(
                            'objects.initiativeActivity.Things_To_Do_Description__c'
                        )}
                        subLabel={helpText(
                            'objects.initiativeActivity.Things_To_Do_Description__c'
                        )}
                        placeholder={label(
                            'custom.FA_FormCaptureTextEntryEmpty'
                        )}
                        maxLength={400}
                        controller={control}
                    />
                    <SelectList
                        name="Activities"
                        label={label(
                            'objects.initiativeActivity.Activity_Tag__c'
                        )}
                        subLabel={helpText(
                            'objects.initiativeActivity.Activity_Tag__c'
                        )}
                        selectPlaceholder={label(
                            'custom.FA_FormCaptureSelectEmpty'
                        )}
                        options={controlledValueSet(
                            'initiativeActivity.Activity_Tag__c',
                            initiative?.Category__c
                        )}
                        buttonLabel={label('custom.FA_ButtonAddActivityTag')}
                        listMaxLength={utilities.isNovoLeadFunder() ? 1 : 4}
                        controller={control}
                        required={utilities.isNovoLeadFunder()}
                    />
                    <SelectList
                        name="Location"
                        label={label(
                            'objects.initiativeActivity.Initiative_Location__c'
                        )}
                        subLabel={helpText(
                            'objects.initiativeActivity.Initiative_Location__c'
                        )}
                        listMaxLength={1}
                        options={valueSet(
                            'initiativeActivity.Initiative_Location__c'
                        )}
                        showText
                        selectPlaceholder={label(
                            'custom.FA_FormCaptureSelectEmpty'
                        )}
                        selectLabel={label('custom.FA_FormCaptureCountry')}
                        textLabel={label('custom.FA_FormCaptureRegion')}
                        controller={control}
                    />
                    {customGoals.length > 0 && (
                        <SelectList
                            name="Goals"
                            label={label('objects.initiativeGoal.Goal__c')}
                            subLabel={helpText(
                                'objects.initiativeGoal.Goal__c'
                            )}
                            options={customGoals.map(goal => ({
                                value: goal.Id,
                                label: goal.Goal__c,
                            }))}
                            selectPlaceholder={label(
                                'custom.FA_FormCaptureSelectEmpty'
                            )}
                            controller={control}
                            buttonLabel={label('custom.FA_ButtonAddGoal')}
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
