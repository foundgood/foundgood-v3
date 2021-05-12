// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
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
import FunderCard from 'components/_wizard/founderCard';

const ActivitiesComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo, valueSet, controlledValueSet, log } = useMetadata();
    log();

    // Hook: useForm setup
    const { handleSubmit, control, setValue, reset } = useForm();
    const { isDirty } = useFormState({ control });

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

    // Store: Initiative data
    const { initiative, updateActivity } = useInitiativeDataStore();

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
        // TODO: Mangler at blive hooket op med "Link to one of your goals"
        // TODO: Only show "intervention" And add when saving
        try {
            const { Things_To_Do__c, Activity_Tag__c, Location } = formData;

            // Object name
            const object = 'Initiative_Activity__c';

            // Data for sf
            const data = {
                Things_To_Do__c,
                Activity_Tag__c,
                Initiative_Location__c: Location[0]?.selectValue,
                Additional_Location_Information__c: Location[0]?.textValue,
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

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const {
            Things_To_Do__c,
            Activity_Tag__c,
            Initiative_Location__c,
            Additional_Location_Information__c,
        } = initiative?._funders[updateId] ?? {};

        setValue('Things_To_Do__c', Things_To_Do__c);
        setValue('Activity_Tag__c', Activity_Tag__c);
        setValue('Location', [
            {
                selectValue: Initiative_Location__c,
                textValue: Additional_Location_Information__c,
            },
        ]);
    }, [updateId, modalIsOpen]);

    return (
        <>
            <TitlePreamble
                title={labelTodo('Outline your activities')}
                preamble={labelTodo('Preamble')}
            />
            <InputWrapper>
                {Object.keys(initiative?._funders).map(funderKey => {
                    const funder = initiative?._funders[funderKey];
                    return (
                        <FunderCard
                            key={funderKey}
                            headline={_get(funder, 'Account__r.Name') || ''}
                            label={_get(funder, 'Type__c') || ''}
                            subHeadline={`${
                                _get(funder, 'CurrencyIsoCode') || ''
                            } ${_get(funder, 'Amount__c') || ''}`}
                            footnote={`${
                                _get(funder, 'Grant_Start_Date__c') || ''
                            } - ${_get(funder, 'Grant_End_Date__c') || ''}`}
                            action={() => {
                                setUpdateId(funderKey);
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
                    />
                    <SelectList
                        name="Activity_Tag__c"
                        label={labelTodo('Activity tag')}
                        subLabel={labelTodo('Select up to 3')}
                        selectPlaceholder={labelTodo('Please select')}
                        options={controlledValueSet(
                            'initiativeActivity.Activity_Tag__c'
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
                    {/* TODO: Initiative_Activity_Goal__c SELECT
                        Create new intitiative activity goals based on goals

                     */}
                </InputWrapper>
            </Modal>
        </>
    );
};

ActivitiesComponent.propTypes = {};

ActivitiesComponent.defaultProps = {};

ActivitiesComponent.layout = 'wizard';

export default ActivitiesComponent;
