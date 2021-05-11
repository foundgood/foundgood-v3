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
    DateRange,
    DatePicker,
} from 'components/_inputs';
import ReportCard from 'components/_wizard/reportCard';

const IndicatorsComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo, valueSet, log } = useMetadata();
    log();

    // Hook: useForm setup
    const { handleSubmit, control, setValue, reset } = useForm();
    const { isDirty } = useFormState({ control });
    const indicatorTypeSelect = useWatch({ control, name: 'Type__c' });

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

    // Store: Initiative data
    const { initiative, updateReport, CONSTANTS } = useInitiativeDataStore();

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
        // TODO: Sørg for at grant giving area kan vælges under INITIATIVE_PREDEFINED hvis ikke det allerede er valgt
        // TODO: Luke sørger for nogle empty-states og et flow
        // TODO: Opdatér store med object _activitySuccessMetrics object, med update funktion og queries med tilsvarende
        // TODO: Generel færdiggørelse med data på kort mv. Husk der er to actions på kortet.
        try {
            const {
                KPI__c,
                Gender,
                Highest_Age__c,
                Lowest_Age__c,
                Success_Metric__c,
            } = formData;

            // Object name
            const object = 'Initiative_Activity_Success_Metric__c';

            // Data for sf
            const data = {
                [CONSTANTS.TYPES.INITIATIVE_CUSTOM]: {
                    Initiative_Activity__c: 'TDB',
                    Success_Metric__c,
                },
                [CONSTANTS.TYPES.INITIATIVE_PREDEFINED]: {
                    Initiative_Activity__c: 'TDB',
                    KPI__c,
                    Gender__c: Gender[0].selectValue,
                    Gender_Other__c: Gender[0].textValue,
                    Highest_Age__c,
                    Lowest_Age__c,
                },
            };

            // Update / Save
            const ReportId = updateId
                ? await update(object, data, updateId)
                : await save(object, { ...data, Initiative__c: initiative.Id });

            // Update store
            await updateReport(ReportId);

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
    const [activity, setActivity] = useState(null);
    const [indicatorType, setIndicatorType] = useState(null);

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const {
            Initiative_Activity__c,
            KPI__c,
            Gender__c,
            Gender_Other__c,
            Highest_Age__c,
            Lowest_Age__c,
            Type__c,
            Success_Metric__c,
        } = initiative?._activitySuccessMetrics[updateId] ?? {};

        setValue('Success_Metric__c', Success_Metric__c);
        setValue('KPI__c', KPI__c);
        setValue('Gender', [
            {
                selectValue: Gender__c,
                textValue: Gender_Other__c,
            },
        ]);
        setValue('Highest_Age__c', Highest_Age__c);
        setValue('Lowest_Age__c', Lowest_Age__c);

        // Set goal type
        setIndicatorType(Type__c);
    }, [updateId, modalIsOpen]);

    // Watch the change of  type
    useEffect(() => {
        setIndicatorType(indicatorTypeSelect);
    }, [indicatorTypeSelect]);

    // Funders
    const activities = Object.keys(initiative._activities);

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
                        const successMetricItems = Object.keys(
                            initiative?._activitySuccessMetrics
                        )
                            .filter(
                                successMetricKey =>
                                    initiative?._activitySuccessMetrics[
                                        successMetricKey
                                    ].xxx === activityKey
                            )
                            .map(
                                successMetricKey =>
                                    initiative?._reports[successMetricKey]
                            );
                        return (
                            <ReportCard
                                key={activity.Id}
                                headline={
                                    _get(activity, 'Account__r.Name') || ''
                                }
                                items={successMetricItems.map(item => ({
                                    id: item.Id,
                                    headline: labelTodo(item.Report_Type__c),
                                    dueDate: labelTodo(item.Due_Date__c),
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
                title={labelTodo(`New report for ${activity?.Account__r.Name}`)}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty}
                onSave={handleSubmit(submit)}>
                <InputWrapper>
                    <Select
                        name="Type__c"
                        label={labelTodo('Type of indicator')}
                        placeholder={labelTodo('Please select')}
                        options={valueSet('initiativeIndicator.Type__c')}
                        controller={control}
                        required
                    />

                    {/* Custom indicator */}
                    {indicatorType === CONSTANTS.TYPES.INDICATOR_CUSTOM && (
                        <Text
                            name="Initiative_Activity_Success_Metric__c"
                            label={labelTodo('Metric name')}
                            placeholder={labelTodo('Enter name')}
                            maxLength={80}
                            controller={control}
                        />
                    )}

                    {/* Predefined indicator */}
                    {indicatorType === CONSTANTS.TYPES.INDICATOR_PREDEFINED && (
                        <p></p>
                    )}

                    <Select
                        name="Report_Type__c"
                        label={labelTodo('Type of report')}
                        placeholder={labelTodo('Please select')}
                        options={valueSet('initiativeReport.Report_Type__c')}
                        controller={control}
                        required
                    />
                    <DatePicker
                        name="Due_Date__c"
                        label={labelTodo('Report deadline')}
                        controller={control}
                        required
                    />
                    <DateRange
                        name="ReportDates"
                        label={labelTodo('Report start / end date')}
                        controller={control}
                    />
                    <Select
                        name="Status__c"
                        label={labelTodo('Report status')}
                        placeholder={labelTodo('Please select')}
                        options={valueSet('initiativeReport.Status__c')}
                        controller={control}
                    />
                </InputWrapper>
            </Modal>
        </>
    );
};

IndicatorsComponent.propTypes = {};

IndicatorsComponent.defaultProps = {};

IndicatorsComponent.layout = 'wizard';

export default IndicatorsComponent;
