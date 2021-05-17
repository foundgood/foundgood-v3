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
import ResultCard from 'components/_wizard/resultCard';

const SharingResultsComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo, valueSet, log } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control, setValue, reset } = useForm();
    const { isDirty } = useFormState({ control });
    const disseminationTypeSelect = useWatch({
        control,
        name: 'Dissemination_Method__c',
    });

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

    // Store: Initiative data
    const { initiative, updateActivity, CONSTANTS } = useInitiativeDataStore();

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
                Things_To_Do__c,
                Dissemination_Method__c,
                Audience_Tag__c,

                Publication_Type__c,
                Publication_Year__c,
                Publication_Title__c,
                Publication_Publisher__c,
                Publication_Author__c,
                Publication_DOI__c,
            } = formData;

            // Object name
            const object = 'Initiative_Activity__c';

            // Data for sf
            const data = {
                Activity_Type__c: CONSTANTS.TYPES.ACTIVITY_DISSEMINATION,

                Things_To_Do__c,
                Dissemination_Method__c,
                Audience_Tag__c: Audience_Tag__c.map(
                    item => item.selectValue
                ).join(';'),

                Publication_Type__c,
                Publication_Year__c,
                Publication_Title__c,
                Publication_Publisher__c,
                Publication_Author__c,
                Publication_DOI__c,
            };

            // Update / Save
            const activityId = updateId
                ? await update(object, data, updateId)
                : await save(object, { ...data, Initiative__c: initiative.Id });

            // Update store
            await updateActivity(activityId);

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
    const [disseminationType, setDisseminationType] = useState(null);

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const {
            Things_To_Do__c,
            Dissemination_Method__c,
            Audience_Tag__c,

            Publication_Type__c,
            Publication_Year__c,
            Publication_Title__c,
            Publication_Publisher__c,
            Publication_Author__c,
            Publication_DOI__c,
        } = initiative?._activities[updateId] ?? {};

        setValue('Things_To_Do__c', Things_To_Do__c);
        setValue('Dissemination_Method__c', Dissemination_Method__c);
        setValue(
            'Audience_Tag__c',
            Audience_Tag__c?.split(';').map(value => ({
                selectValue: value,
            }))
        );

        setValue('Publication_Type__c', Publication_Type__c);
        setValue('Publication_Year__c', Publication_Year__c);
        setValue('Publication_Title__c', Publication_Title__c);
        setValue('Publication_Publisher__c', Publication_Publisher__c);
        setValue('Publication_Author__c', Publication_Author__c);
        setValue('Publication_DOI__c', Publication_DOI__c);

        // Set dissemination type
        setDisseminationType(Dissemination_Method__c);
    }, [updateId, modalIsOpen]);

    // Watch the change of goal type
    useEffect(() => {
        setDisseminationType(disseminationTypeSelect);
    }, [disseminationTypeSelect]);

    return (
        <>
            <TitlePreamble
                title={labelTodo('How are your results being shared?')}
                preamble={labelTodo('Preamble')}
            />
            <InputWrapper>
                {Object.keys(initiative?._activities)
                    .filter(activityKey => {
                        const activity = initiative?._activities[activityKey];
                        return (
                            activity.Activity_Type__c ===
                            CONSTANTS.TYPES.ACTIVITY_DISSEMINATION
                        );
                    })
                    .map(activityKey => {
                        const activity = initiative?._activities[activityKey];

                        const headline =
                            _get(activity, 'Things_To_Do__c') || '';

                        const footnote = `${
                            _get(activity, 'Dissemination_Method__c') || ''
                        } ${
                            activity.Dissemination_Method__c &&
                            activity.KPI_Category__c
                                ? '•'
                                : ''
                        } ${_get(activity, 'KPI_Category__c') || ''}`;

                        const tagsString = activity?.Audience_Tag__c ?? null;
                        const tags = tagsString ? tagsString.split(';') : [];

                        return (
                            <ResultCard
                                key={activityKey}
                                headline={headline}
                                footnote={footnote}
                                tags={tags}
                                action={() => {
                                    setUpdateId(activityKey);
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
                    {labelTodo('Add activity')}
                </Button>
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={labelTodo('Add new sharing of results')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty}
                onSave={handleSubmit(submit)}>
                <InputWrapper>
                    <Text
                        name="Things_To_Do__c"
                        label={labelTodo('Name')}
                        placeholder={labelTodo('Enter sharing name')}
                        maxLength={200}
                        controller={control}
                        required
                    />

                    <Select
                        name="Dissemination_Method__c"
                        label={labelTodo('Sharing method')}
                        placeholder={labelTodo('Please select')}
                        options={valueSet(
                            'initiativeActivity.Dissemination_Method__c'
                        )}
                        controller={control}
                        required
                    />

                    <SelectList
                        name="Audience_Tag__c"
                        label={labelTodo('Audience tag')}
                        selectPlaceholder={labelTodo('Please select')}
                        options={valueSet('initiativeActivity.Audience_Tag__c')}
                        listMaxLength={4}
                        controller={control}
                        required
                    />

                    {/* Predefined goal */}
                    {disseminationType === CONSTANTS.TYPES.ACTIVITY_JOURNAL && (
                        <>
                            <Text
                                name="Publication_Type__c"
                                label={labelTodo('Publication type')}
                                placeholder={labelTodo(
                                    'Enter publication type'
                                )}
                                maxLength={30}
                                controller={control}
                            />
                            <DatePicker
                                name="Publication_Year__c"
                                label={labelTodo('Publication year')}
                                controller={control}
                            />
                            <Text
                                name="Publication_Title__c"
                                label={labelTodo('Publication title')}
                                placeholder={labelTodo(
                                    'Enter publication type'
                                )}
                                maxLength={200}
                                controller={control}
                            />
                            <Text
                                name="Publication_Publisher__c"
                                label={labelTodo('Publication publisher')}
                                placeholder={labelTodo(
                                    'Enter publication type'
                                )}
                                maxLength={200}
                                controller={control}
                            />
                            <Text
                                name="Publication_Author__c"
                                label={labelTodo('Publication author')}
                                placeholder={labelTodo(
                                    'Enter publication author'
                                )}
                                maxLength={80}
                                controller={control}
                            />
                            <Text
                                name="Publication_DOI__c"
                                label={labelTodo('Publication DOI')}
                                placeholder={labelTodo('Enter publication DOI')}
                                maxLength={30}
                                controller={control}
                            />
                        </>
                    )}
                </InputWrapper>
            </Modal>
        </>
    );
};

SharingResultsComponent.propTypes = {};

SharingResultsComponent.defaultProps = {};

SharingResultsComponent.layout = 'wizard';

export default SharingResultsComponent;
