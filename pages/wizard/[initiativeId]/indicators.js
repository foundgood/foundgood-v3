// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import { useAuth, useLabels, useElseware } from 'utilities/hooks';
import {
    useInitiativeDataStore,
    useWizardNavigationStore,
} from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import Modal from 'components/modal';
import { InputWrapper, Select, SelectList, Text } from 'components/_inputs';
import KpiCard from 'components/_wizard/kpiCard';

const IndicatorsComponent = ({ pageProps }) => {
    // ///////////////////
    // AUTH
    // ///////////////////

    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // ///////////////////
    // STORES
    // ///////////////////

    // Store: Wizard navigation
    const { currentItem, setCurrentSubmitHandler } = useWizardNavigationStore();

    // Store: Initiative data
    const { initiative, utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const {
        label,
        object,
        valueSet,
        getValueLabel,
        controlledValueSet,
    } = useLabels();
    const { ewCreateUpdateWrapper } = useElseware();

    // ///////////////////
    // STATE
    // ///////////////////

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsSaving, setModalIsSaving] = useState(false);
    const [indicatorType, setIndiciatorType] = useState(null);
    const [updateId, setUpdateId] = useState(null);
    const [activity, setActivity] = useState(null);

    // ///////////////////
    // FORMS
    // ///////////////////

    const { handleSubmit, control, setValue, reset } = useForm();
    const { isDirty } = useFormState({ control });

    // ///////////////////
    // METHODS
    // ///////////////////

    // Method: Adds founder to sf and updates founder list in view
    async function submit(formData) {
        // Modal save button state
        setModalIsSaving(true);

        try {
            const { KPI__c, Gender, Name } = formData;

            // Get age
            const indicatorWithAge =
                CONSTANTS.CUSTOM.INDICATOR_KPI_AGED.filter(
                    i => KPI__c === i.value
                )[0] ?? false;

            // Data for sf
            const data = {
                [CONSTANTS.ACTIVITY_SUCCESS_METRICS.INDICATOR_CUSTOM]: {
                    Type__c: indicatorType,
                    Name,
                    KPI_Category__c: initiative?.Category__c,
                },
                [CONSTANTS.ACTIVITY_SUCCESS_METRICS.INDICATOR_PREDEFINED]: {
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
            await ewCreateUpdateWrapper(
                'initiative-activity-success-metric/initiative-activity-success-metric',
                updateId,
                data[indicatorType],
                { Initiative_Activity__c: activity.Id },
                '_activitySuccessMetrics'
            );

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

    // ///////////////////
    // EFFECTS
    // ///////////////////

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const {
            KPI__c,
            Gender__c,
            Gender_Other__c,
            Type__c,
            Name,
        } = utilities.activitySuccessMetrics.get(updateId);

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

    // Reset submithandler
    useEffect(() => {
        setTimeout(() => {
            setCurrentSubmitHandler(null);
        }, 100);
    }, [initiative]);

    // ///////////////////
    // DATA
    // ///////////////////

    // Activities
    const activities = utilities.activities.getTypeIntervention();

    return (
        <>
            <TitlePreamble />
            <InputWrapper>
                {activities.length > 0 ? (
                    activities.map(activity => (
                        <KpiCard
                            key={activity.Id}
                            headline={_get(activity, 'Things_To_Do__c') || ''}
                            peopleItems={utilities.activitySuccessMetrics
                                .getTypePredefinedFromActivityId(activity.Id)
                                .map(item => {
                                    let headline;
                                    // Get gender
                                    const gender = item.Gender__c
                                        ? getValueLabel(
                                              'initiativeActivitySuccessMetric.Gender__c',
                                              item.Gender__c
                                          )
                                        : '';
                                    const genderOther = item.Gender_Other__c
                                        ? ` ${item.Gender_Other__c}`
                                        : '';

                                    // Get KPI
                                    const kpi = item.KPI__c
                                        ? ` ${getValueLabel(
                                              'initiativeActivitySuccessMetric.KPI__c',
                                              item.KPI__c,
                                              true
                                          )} `
                                        : '';

                                    headline = `${gender}${genderOther}${kpi}`;

                                    // Remove Unspecified
                                    headline = headline.replace(
                                        'Unspecified ',
                                        ''
                                    );

                                    return {
                                        id: item.Id,
                                        headline,
                                        label: item.Type__c,
                                    };
                                })}
                            metricItems={utilities.activitySuccessMetrics
                                .getTypeCustomFromActivityId(activity.Id)
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
                                    CONSTANTS.ACTIVITY_SUCCESS_METRICS
                                        .INDICATOR_PREDEFINED
                                );
                            }}
                            actionCreateMetric={() => {
                                setModalIsOpen(true);
                                setActivity(activity);
                                setIndiciatorType(
                                    CONSTANTS.ACTIVITY_SUCCESS_METRICS
                                        .INDICATOR_CUSTOM
                                );
                            }}
                            actionUpdate={(item, indicator) => {
                                setModalIsOpen(true);
                                setUpdateId(item.id);
                                setActivity(activity);
                                setIndiciatorType(indicator);
                            }}
                        />
                    ))
                ) : (
                    <p className="t-h5">
                        {label('WizardEmptyStatesIndicators')}
                    </p>
                )}
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={label('WizardModalHeadingIndicators')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty || modalIsSaving}
                onSave={handleSubmit(submit)}>
                <InputWrapper>
                    {/* Custom indicator */}
                    {indicatorType ===
                        CONSTANTS.ACTIVITY_SUCCESS_METRICS.INDICATOR_CUSTOM && (
                        <Text
                            name="Name"
                            label={label('InitiativeActivitySuccessMetricName')}
                            placeholder={label('FormCaptureTextEntryEmpty')}
                            maxLength={80}
                            controller={control}
                        />
                    )}
                    {/* Predefined indicator */}
                    {indicatorType ===
                        CONSTANTS.ACTIVITY_SUCCESS_METRICS
                            .INDICATOR_PREDEFINED && (
                        <>
                            <Select
                                name="KPI__c"
                                label={object.label(
                                    'Initiative_Activity_Success_Metric__c.KPI__c'
                                )}
                                subLabel={object.helpText(
                                    'Initiative_Activity_Success_Metric__c.KPI__c'
                                )}
                                placeholder={label('FormCaptureSelectEmpty')}
                                options={controlledValueSet(
                                    'initiativeActivitySuccessMetric.KPI__c',
                                    initiative?.Category__c
                                )}
                                controller={control}
                            />
                            <SelectList
                                name="Gender"
                                label={object.label(
                                    'Initiative_Activity_Success_Metric__c.Gender__c'
                                )}
                                subLabel={object.helpText(
                                    'Initiative_Activity_Success_Metric__c.Gender__c'
                                )}
                                selectPlaceholder={label(
                                    'FormCaptureSelectEmpty'
                                )}
                                textPlaceholder={object.label(
                                    'Initiative_Activity_Success_Metric__c.Gender_Other__c'
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
