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

const FundersComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo, valueSet } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control, setValue, reset } = useForm();
    const { isDirty } = useFormState({ control });

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

    // Store: Initiative data
    const { initiative, updateFunder } = useInitiativeDataStore();

    // Get data for form
    const { data: accountFoundations } = sfQuery(
        queries.account.allFoundations()
    );

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
                Contribution,
                GrantDate,
                Account__c,
                Type__c,
                Approval_date__c,
                Application_Id__c,
            } = formData;

            // Object name
            const object = 'Initiative_Funder__c';

            // Data for sf
            const data = {
                Account__c,
                Type__c,
                Amount__c: Contribution[0]?.textValue,
                CurrencyIsoCode: Contribution[0]?.selectValue,
                Approval_date__c,
                Grant_Start_Date__c: GrantDate.from,
                Grant_End_Date__c: GrantDate.to,
                Application_Id__c,
            };

            // Update / Save
            const funderId = updateId
                ? await update(object, data, updateId)
                : await save(object, { ...data, Initiative__c: initiative.Id });

            // Update store
            await updateFunder(funderId);

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
            Type__c,
            Account__c,
            CurrencyIsoCode,
            Amount__c,
            Approval_date__c,
            Application_Id__c,
            Grant_Start_Date__c,
            Grant_End_Date__c,
        } = initiative?._funders[updateId] ?? {};

        setValue('Type__c', Type__c);
        setValue('Account__c', Account__c);
        setValue('Contribution', [
            { selectValue: CurrencyIsoCode, textValue: Amount__c },
        ]);
        setValue('Approval_date__c', Approval_date__c);
        setValue('GrantDate', {
            from: Grant_Start_Date__c,
            to: Grant_End_Date__c,
        });
        setValue('Application_Id__c', Application_Id__c);
    }, [updateId, modalIsOpen]);

    return (
        <>
            <TitlePreamble
                title={labelTodo('Who is funding the initiative?')}
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
                    {labelTodo('Add funder')}
                </Button>
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={labelTodo('Add new funder')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty}
                onSave={handleSubmit(submit)}>
                <InputWrapper>
                    <Select
                        name="Account__c"
                        label={labelTodo('Name of funder')}
                        placeholder={labelTodo('Please select')}
                        options={
                            accountFoundations?.records?.map(item => ({
                                label: item.Name,
                                value: item.Id,
                            })) ?? []
                        }
                        required
                        controller={control}
                    />
                    <Select
                        name="Type__c"
                        label={labelTodo('Type of funder')}
                        placeholder={labelTodo('Please select')}
                        options={valueSet('initiativeFunder.Type__c')}
                        controller={control}
                        required
                    />
                    <SelectList
                        name="Contribution"
                        showText
                        selectPlaceholder={labelTodo('Please select')}
                        label={labelTodo('Contribution')}
                        listMaxLength={1}
                        options={[
                            { label: 'DKK', value: 'DKK' },
                            { label: 'EUR', value: 'EUR' },
                        ]}
                        selectLabel={labelTodo('Currency')}
                        textLabel={labelTodo('Amount granted')}
                        controller={control}
                    />
                    <DatePicker
                        name="Approval_date__c"
                        label={labelTodo('Approval date')}
                        controller={control}
                    />
                    <DateRange
                        name="GrantDate"
                        label={labelTodo('Grant period')}
                        controller={control}
                    />
                    <Text
                        name="Application_Id__c"
                        label={labelTodo('Application ID number')}
                        placeholder={labelTodo('Enter ID')}
                        maxLength={15}
                        controller={control}
                    />
                </InputWrapper>
            </Modal>
        </>
    );
};

FundersComponent.propTypes = {};

FundersComponent.defaultProps = {};

FundersComponent.layout = 'wizard';

export default FundersComponent;
