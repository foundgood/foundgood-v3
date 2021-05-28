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
    const indicatorTypeSelect = useWatch({ control, name: 'Type__c' });
    const kpiTypeSelect = useWatch({ control, name: 'KPI__c' });

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

            // Data for sf
            const data = {
                [CONSTANTS.TYPES.INDICATOR_CUSTOM]: {
                    Type__c,
                    Name,
                    KPI_Category__c: initiative?.Category__c,
                },
                [CONSTANTS.TYPES.INDICATOR_PREDEFINED]: {
                    Type__c,
                    KPI__c,
                    Name: KPI__c,
                    Gender__c: Gender ? Gender[0].selectValue : '',
                    Gender_Other__c: Gender ? Gender[0].textValue : '',
                    Highest_Age__c,
                    Lowest_Age__c,
                    KPI_Category__c: initiative?.Category__c,
                },
            };

            // Update / Save
            const ActivitySuccessMetricId = updateId
                ? await sfUpdate({
                      object,
                      data: data[indicatorTypeSelect],
                      id: updateId,
                  })
                : await sfCreate({
                      object,
                      data: {
                          ...data[indicatorTypeSelect],
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

    // We set an update id when updating and remove when adding
    const [updateId, setUpdateId] = useState(null);
    const [activity, setActivity] = useState(null);

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const {
            KPI__c,
            Gender__c,
            Gender_Other__c,
            Highest_Age__c,
            Lowest_Age__c,
            Type__c,
            Name,
        } = initiative?._activitySuccessMetrics[updateId] ?? {};

        setValue('Type__c', Type__c);

        setValue('Name', Name);
        setValue('KPI__c', KPI__c);
        setValue('Gender', [
            {
                selectValue: Gender__c,
                textValue: Gender_Other__c,
            },
        ]);
        setValue('Highest_Age__c', Highest_Age__c);
        setValue('Lowest_Age__c', Lowest_Age__c);
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

    // Do crazy shit when kpi has something with age in it
    useEffect(() => {
        const currentKpi = CONSTANTS.CUSTOM.INDICATOR_KPI_AGED.filter(
            item => item.value === kpiTypeSelect
        );

        // If we have a custom aged indicator please set it
        if (currentKpi.length > 0) {
            setValue('Highest_Age__c', currentKpi[0].max);
            setValue('Lowest_Age__c', currentKpi[0].min);
        } else {
            setValue('Highest_Age__c', null);
            setValue('Lowest_Age__c', null);
        }
    }, [kpiTypeSelect]);

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
                                items={successMetricItems.map(item => {
                                    let headline;

                                    if (
                                        item.Type__c ===
                                        CONSTANTS.TYPES.INDICATOR_CUSTOM
                                    ) {
                                        headline = item.Name;
                                    } else {
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

                                        // Get age
                                        const lowestAge =
                                            CONSTANTS.CUSTOM.INDICATOR_KPI_AGED.filter(
                                                i => item.KPI__c === i.value
                                            ).length === 0 && item.Lowest_Age__c
                                                ? `${item.Lowest_Age__c}`
                                                : '';

                                        const highestAge =
                                            CONSTANTS.CUSTOM.INDICATOR_KPI_AGED.filter(
                                                i => item.KPI__c === i.value
                                            ).length === 0 &&
                                            item.Highest_Age__c
                                                ? `${item.Highest_Age__c}`
                                                : '';

                                        const age =
                                            lowestAge && highestAge
                                                ? `${lowestAge}-${highestAge}`
                                                : `${lowestAge}${highestAge}`;

                                        headline = `${gender}${genderOther}${kpi}${age}`;
                                    }

                                    return {
                                        id: item.Id,
                                        headline,
                                        label: item.Type__c,
                                    };
                                })}
                                actionCreate={() => {
                                    setModalIsOpen(true);
                                    setActivity(activity);
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
                    <Select
                        name="Type__c"
                        label={label(
                            'objects.initiativeActivitySuccessMetric.Type__c'
                        )}
                        subLabel={helpText(
                            'objects.initiativeActivitySuccessMetric.Type__c'
                        )}
                        placeholder={label('custom.FA_FormCaptureSelectEmpty')}
                        options={valueSet(
                            'initiativeActivitySuccessMetric.Type__c'
                        )}
                        controller={control}
                        required
                    />

                    {/* Custom indicator */}
                    {indicatorTypeSelect ===
                        CONSTANTS.TYPES.INDICATOR_CUSTOM && (
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
                    {indicatorTypeSelect ===
                        CONSTANTS.TYPES.INDICATOR_PREDEFINED && (
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
                            {CONSTANTS.CUSTOM.INDICATOR_KPI_AGED.filter(
                                item => item.value === kpiTypeSelect
                            ).length === 0 && (
                                <>
                                    <Number
                                        name="Lowest_Age__c"
                                        label={label(
                                            'objects.initiativeActivitySuccessMetric.Lowest_Age__c'
                                        )}
                                        subLabel={helpText(
                                            'objects.initiativeActivitySuccessMetric.Lowest_Age__c'
                                        )}
                                        placeholder={label(
                                            'custom.FA_FormCaptureNumberEmpty'
                                        )}
                                        minValue={0}
                                        maxValue={150}
                                        controller={control}
                                    />
                                    <Number
                                        name="Highest_Age__c"
                                        label={label(
                                            'objects.initiativeActivitySuccessMetric.Highest_Age__c'
                                        )}
                                        subLabel={helpText(
                                            'objects.initiativeActivitySuccessMetric.Highest_Age__c'
                                        )}
                                        placeholder={label(
                                            'custom.FA_FormCaptureNumberEmpty'
                                        )}
                                        minValue={0}
                                        maxValue={150}
                                        controller={control}
                                    />
                                </>
                            )}
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
