// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState, useWatch } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import { useAuth, useMetadata, useSalesForce } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

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
    DateRange,
    DatePicker,
} from 'components/_inputs';
import KpiCard from 'components/_wizard/kpiCard';

const IndicatorsComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo, valueSet, log, controlledValueSet } = useMetadata();
    log();

    // Hook: useForm setup
    const { handleSubmit, control, setValue, reset, unregister } = useForm();
    const { isDirty } = useFormState({ control });
    const indicatorTypeSelect = useWatch({ control, name: 'Type__c' });

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

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
                title={labelTodo(
                    'What are the indicators for your activities?'
                )}
                preamble={labelTodo('Preamble')}
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
                        {labelTodo('No activities added to the initiative yet')}
                    </p>
                )}
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={labelTodo(`New KPI for ${activity?.Things_To_Do__c}`)}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty}
                onSave={handleSubmit(submit)}>
                <InputWrapper>
                    <Select
                        name="Type__c"
                        label={labelTodo('Type of KPI')}
                        placeholder={labelTodo('Please select')}
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
                            label={labelTodo('Metric name')}
                            placeholder={labelTodo(
                                'Enter name - e.g. schools built'
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
                                label={labelTodo('Tag')}
                                placeholder={labelTodo('Please select')}
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
                                label={labelTodo('Gender')}
                                selectPlaceholder={labelTodo('Please select')}
                                textPlaceholder={labelTodo(
                                    'If "other" feel free to specify'
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
                                label={labelTodo('Lowest age')}
                                placeholder={labelTodo('Enter age')}
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
                                label={labelTodo('Highest age')}
                                placeholder={labelTodo('Enter age')}
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
