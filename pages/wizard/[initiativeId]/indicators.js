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

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

    // Store: Wizard navigation
    const { currentItem } = useWizardNavigationStore();

    // Store: Initiative data
    const {
        initiative,
        updateActivitySuccessMetric,
        CONSTANTS,
    } = useInitiativeDataStore();

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
                ? await update(object, data[indicatorType], updateId)
                : await save(object, {
                      ...data[indicatorType],
                      Initiative_Activity__c: activity.Id,
                  });

            // Update store
            await updateActivitySuccessMetric(ActivitySuccessMetricId);

            // Close modal
            setModalIsOpen(false);

            // Clear content in form
            reset();
            setIndicatorType(null);
            setActivity(null);
            setUpdateId(null);
        } catch (error) {
            console.warn(error);
        }
    }

    // Local state to handle modal
    const [modalIsOpen, setModalIsOpen] = useState(false);

    // We set an update id when updating and remove when adding
    const [updateId, setUpdateId] = useState(null);
    const [activity, setActivity] = useState(null);
    const [indicatorType, setIndicatorType] = useState(null);

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

        // Set indicator type
        setIndicatorType(Type__c);
    }, [updateId, modalIsOpen]);

    // Watch the change of  type
    useEffect(() => {
        setIndicatorType(indicatorTypeSelect);

        // Use this logic in order to have dynamic required validation
        if (indicatorTypeSelect === CONSTANTS.TYPES.INDICATOR_CUSTOM) {
            unregister('Name');
        } else {
            unregister('KPI__c');
            unregister('Gender');
            unregister('Lowest_Age__c');
            unregister('Highest_Age__c');
        }
    }, [indicatorTypeSelect]);

    // Funders
    const activities = Object.keys(initiative?._activities);

    return (
        <>
            <TitlePreamble
                title={label(currentItem?.item?.labels?.form?.title)}
                preamble={label(currentItem?.item?.labels?.form?.preamble)}
            />
            <InputWrapper>
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
                                items={successMetricItems.map(item => ({
                                    id: item.Id,
                                    headline:
                                        item.Type__c ===
                                        CONSTANTS.TYPES.INDICATOR_CUSTOM
                                            ? item.Name
                                            : `${item.Gender__c} ${
                                                  item.Gender_Other__c
                                                      ? `(${item.Gender_Other__c})`
                                                      : ''
                                              } ${item.KPI__c} ${
                                                  item.Lowest_Age__c
                                              }-${item.Highest_Age__c}`,
                                    label: item.Type__c,
                                }))}
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
                disabledSave={!isDirty}
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
                        placeholder={labelTodo('SELECT_PLACEHOLDER')}
                        options={valueSet(
                            'initiativeActivitySuccessMetric.Type__c'
                        )}
                        controller={control}
                        required
                    />

                    {/* Custom indicator */}
                    {indicatorType === CONSTANTS.TYPES.INDICATOR_CUSTOM && (
                        <Text
                            name="Name"
                            label={label(
                                'custom.FA_InitiativeActivitySuccessMetricName'
                            )}
                            placeholder={labelTodo('TEXT_PLACEHOLDER')}
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
                                placeholder={labelTodo('SELECT_PLACEHOLDER')}
                                options={controlledValueSet(
                                    'initiativeActivitySuccessMetric.KPI__c',
                                    initiative?.Category__c
                                )}
                                controller={control}
                                required={
                                    indicatorType ===
                                    CONSTANTS.TYPES.INDICATOR_PREDEFINED
                                }
                            />
                            <SelectList
                                name="Gender"
                                label={label(
                                    'objects.initiativeActivitySuccessMetric.Gender__c'
                                )}
                                subLabel={helpText(
                                    'objects.initiativeActivitySuccessMetric.Gender__c'
                                )}
                                selectPlaceholder={labelTodo(
                                    'SELECT_PLACEHOLDER'
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
                                required={
                                    indicatorType ===
                                    CONSTANTS.TYPES.INDICATOR_PREDEFINED
                                }
                            />
                            <Number
                                name="Lowest_Age__c"
                                label={label(
                                    'objects.initiativeActivitySuccessMetric.Lowest_Age__c'
                                )}
                                subLabel={helpText(
                                    'objects.initiativeActivitySuccessMetric.Lowest_Age__c'
                                )}
                                placeholder={labelTodo('NUMBER_PLACEHOLDER')}
                                minValue={0}
                                maxValue={150}
                                controller={control}
                                required={
                                    indicatorType ===
                                    CONSTANTS.TYPES.INDICATOR_PREDEFINED
                                }
                            />
                            <Number
                                name="Highest_Age__c"
                                label={label(
                                    'objects.initiativeActivitySuccessMetric.Highest_Age__c'
                                )}
                                subLabel={helpText(
                                    'objects.initiativeActivitySuccessMetric.Highest_Age__c'
                                )}
                                placeholder={labelTodo('NUMBER_PLACEHOLDER')}
                                minValue={0}
                                maxValue={150}
                                controller={control}
                                required={
                                    indicatorType ===
                                    CONSTANTS.TYPES.INDICATOR_PREDEFINED
                                }
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
