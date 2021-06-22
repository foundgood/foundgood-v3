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
import {
    InputWrapper,
    Select,
    SelectList,
    Text,
    Number,
} from 'components/_inputs';
import KpiCard from 'components/_wizard/kpiCard';

const IndicatorsComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const {
        labelTodo,
        label,
        valueSet,
        helpText,
        log,
        controlledValueSet,
    } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control, setValue, reset, unregister } = useForm();
    const { isDirty } = useFormState({ control });

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

    // Store: Wizard navigation
    const { currentItem, setCurrentSubmitHandler } = useWizardNavigationStore();

    // Store: Initiative data
    const {
        initiative,
        updateActivitySuccessMetric,
        CONSTANTS,
    } = useInitiativeDataStore();

    // Method: Adds founder to sf and updates founder list in view
    async function submit(formData) {
        // Modal save button state
        setModalIsSaving(true);
        try {
            const {
                KPI__c,
                Gender,
                Highest_Age__c,
                Lowest_Age__c,
                Name,
                Type__c,
            } = formData;

            // Object name
            const object = 'Initiative_Activity_Success_Metric__c';

            // Get age
            const indicatorWithAge =
                CONSTANTS.CUSTOM.INDICATOR_KPI_AGED.filter(
                    i => KPI__c === i.value
                )[0] ?? false;

            // Data for sf
            const data = {
                [CONSTANTS.TYPES.INDICATOR_CUSTOM]: {
                    Type__c: indicatorType,
                    Name,
                    KPI_Category__c: initiative?.Category__c,
                },
                [CONSTANTS.TYPES.INDICATOR_PREDEFINED]: {
                    Type__c: indicatorType,
                    KPI__c,
                    Name: KPI__c,
                    Gender__c: Gender ? Gender[0].selectValue : '',
                    Gender_Other__c: Gender ? Gender[0].textValue : '',
                    Highest_Age__c: indicatorWithAge
                        ? indicatorWithAge.max
                        : '',
                    Lowest_Age__c: indicatorWithAge ? indicatorWithAge.min : '',
                    KPI_Category__c: initiative?.Category__c,
                },
            };

            // Update / Save
            const ActivitySuccessMetricId = updateId
                ? await sfUpdate({
                      object,
                      data: data[indicatorType],
                      id: updateId,
                  })
                : await sfCreate({
                      object,
                      data: {
                          ...data[indicatorType],
                          Initiative_Activity__c: activity.Id,
                      },
                  });

            // Update store
            await updateActivitySuccessMetric(ActivitySuccessMetricId);

            // Close modal
            setModalIsOpen(false);

            // Modal save button state
            setModalIsSaving(false);

            // Clear content in form
            reset();
            setActivity(null);
            setUpdateId(null);
        } catch (error) {
            // Modal save button state
            setModalIsSaving(false);
            console.warn(error);
        }
    }

    // Local state to handle modal
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsSaving, setModalIsSaving] = useState(false);
    const [indicatorType, setIndiciatorType] = useState(null);

    // We set an update id when updating and remove when adding
    const [updateId, setUpdateId] = useState(null);
    const [activity, setActivity] = useState(null);

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const { KPI__c, Gender__c, Gender_Other__c, Type__c, Name } =
            initiative?._activitySuccessMetrics[updateId] ?? {};

        setValue('Type__c', Type__c);

        setValue('Name', Name);
        setValue('KPI__c', KPI__c);
        setValue('Gender', [
            {
                selectValue: Gender__c,
                textValue: Gender_Other__c,
            },
        ]);
    }, [updateId, modalIsOpen]);

    // Activities
    const activities = Object.keys(initiative?._activities).filter(
        activityKey => {
            const activity = initiative?._activities[activityKey];
            return (
                activity.Activity_Type__c ===
                CONSTANTS.TYPES.ACTIVITY_INTERVENTION
            );
        }
    );

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
                {activities.length > 0 ? (
                    activities.map(activityKey => {
                        const activity = initiative?._activities[activityKey];
                        // Get success metric items based on activity id (activityKey) and activitySuccessMetric.XXX
                        const successMetricItems = Object.values(
                            initiative?._activitySuccessMetrics
                        ).filter(
                            item => item.Initiative_Activity__c === activityKey
                        );

                        return (
                            <KpiCard
                                key={activity.Id}
                                headline={
                                    _get(activity, 'Things_To_Do__c') || ''
                                }
                                peopleItems={successMetricItems
                                    .filter(
                                        item =>
                                            item.Type__c ===
                                            CONSTANTS.TYPES.INDICATOR_PREDEFINED
                                    )
                                    .map(item => {
                                        let headline;
                                        // Get gender
                                        const gender = item.Gender__c
                                            ? item.Gender__c
                                            : '';
                                        const genderOther = item.Gender_Other__c
                                            ? ` ${item.Gender_Other__c}`
                                            : '';

                                        // Get KPI
                                        const kpi = item.KPI__c
                                            ? ` ${item.KPI__c} `
                                            : '';

                                        headline = `${gender}${genderOther}${kpi}`;

                                        return {
                                            id: item.Id,
                                            headline,
                                            label: item.Type__c,
                                        };
                                    })}
                                metricItems={successMetricItems
                                    .filter(
                                        item =>
                                            item.Type__c ===
                                            CONSTANTS.TYPES.INDICATOR_CUSTOM
                                    )
                                    .map(item => {
                                        let headline = item.Name;

                                        return {
                                            id: item.Id,
                                            headline,
                                            label: item.Type__c,
                                        };
                                    })}
                                actionCreatePeople={() => {
                                    setModalIsOpen(true);
                                    setActivity(activity);
                                    setIndiciatorType(
                                        CONSTANTS.TYPES.INDICATOR_PREDEFINED
                                    );
                                }}
                                actionCreateMetric={() => {
                                    setModalIsOpen(true);
                                    setActivity(activity);
                                    setIndiciatorType(
                                        CONSTANTS.TYPES.INDICATOR_CUSTOM
                                    );
                                }}
                                actionUpdate={item => {
                                    setModalIsOpen(true);
                                    setUpdateId(item.id);
                                    setActivity(activity);
                                }}
                            />
                        );
                    })
                ) : (
                    <p className="t-h5">
                        {label('custom.FA_WizardEmptyStatesIndicators')}
                    </p>
                )}
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={label('custom.FA_WizardModalHeadingIndicators')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty || modalIsSaving}
                onSave={handleSubmit(submit)}>
                <InputWrapper>
                    {/* Custom indicator */}
                    {indicatorType === CONSTANTS.TYPES.INDICATOR_CUSTOM && (
                        <Text
                            name="Name"
                            label={label(
                                'custom.FA_InitiativeActivitySuccessMetricName'
                            )}
                            placeholder={label(
                                'custom.FA_FormCaptureTextEntryEmpty'
                            )}
                            maxLength={80}
                            controller={control}
                        />
                    )}
                    {/* Predefined indicator */}
                    {indicatorType === CONSTANTS.TYPES.INDICATOR_PREDEFINED && (
                        <>
                            <Select
                                name="KPI__c"
                                label={label(
                                    'objects.initiativeActivitySuccessMetric.KPI__c'
                                )}
                                subLabel={helpText(
                                    'objects.initiativeActivitySuccessMetric.KPI__c'
                                )}
                                placeholder={label(
                                    'custom.FA_FormCaptureSelectEmpty'
                                )}
                                options={controlledValueSet(
                                    'initiativeActivitySuccessMetric.KPI__c',
                                    initiative?.Category__c
                                )}
                                controller={control}
                            />
                            <SelectList
                                name="Gender"
                                label={label(
                                    'objects.initiativeActivitySuccessMetric.Gender__c'
                                )}
                                subLabel={helpText(
                                    'objects.initiativeActivitySuccessMetric.Gender__c'
                                )}
                                selectPlaceholder={label(
                                    'custom.FA_FormCaptureSelectEmpty'
                                )}
                                textPlaceholder={label(
                                    'objects.initiativeActivitySuccessMetric.Gender_Other__c'
                                )}
                                options={valueSet(
                                    'initiativeActivitySuccessMetric.Gender__c'
                                )}
                                showText
                                listMaxLength={1}
                                controller={control}
                            />
                        </>
                    )}
                </InputWrapper>
            </Modal>
        </>
    );
};

IndicatorsComponent.propTypes = {};

IndicatorsComponent.defaultProps = {};

IndicatorsComponent.layout = 'wizard';

export default IndicatorsComponent;
