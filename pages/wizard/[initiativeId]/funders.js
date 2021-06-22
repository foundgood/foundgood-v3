// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import {
    useAuth,
    useMetadata,
    useSalesForce,
    useContext,
} from 'utilities/hooks';
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
    DateRange,
    DatePicker,
} from 'components/_inputs';
import FunderCard from 'components/_wizard/founderCard';

const FundersComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Context for wizard pages
    const { MODE, CONTEXTS, UPDATE, REPORT_ID } = useContext();

    // Hook: Metadata
    const { labelTodo, label, helpText, valueSet } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control, setValue, reset } = useForm();
    const {
        handleSubmit: handleSubmitReflections,
        control: controlReflections,
    } = useForm();
    const { isDirty } = useFormState({ control });

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

    // Store: Initiative data
    const {
        initiative,
        getReportDetails,
        updateFunder,
        updateReportDetails,
        isNovoLeadFunder,
        CONSTANTS,
    } = useInitiativeDataStore();

    // Store: Wizard navigation
    const { setCurrentSubmitHandler, currentItem } = useWizardNavigationStore();

    // Get data for form
    const { data: accountFoundations } = sfQuery(
        queries.account.allFoundations()
    );

    // Method: Adds founder to sf and updates founder list in view
    async function submit(formData) {
        // Modal save button state
        setModalIsSaving(true);
        try {
            const {
                Contribution,
                GrantDate,
                Account__c,
                Type__c,
                Approval_Date__c,
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
                Approval_Date__c,
                Grant_Start_Date__c: GrantDate.from,
                Grant_End_Date__c: GrantDate.to,
                Application_Id__c,
            };

            // Update / Save
            const funderId = updateId
                ? await sfUpdate({ object, data, id: updateId })
                : await sfCreate({
                      object,
                      data: { ...data, Initiative__c: initiative.Id },
                  });

            // Update store
            await updateFunder(funderId);

            // Close modal
            setModalIsOpen(false);

            // Modal save button state
            setModalIsSaving(false);

            // Clear content in form
            reset();
        } catch (error) {
            // Modal save button state
            setModalIsSaving(false);
            console.warn(error);
        }
    }

    // Method: Adds reflections
    async function submitReflections(formData) {
        // Reformat form data based on topic keys
        const reportDetails = Object.keys(initiative?._funders)
            .reduce((acc, key) => {
                // Does the reflection relation exist already?
                const currentReflection = currentReportDetails.filter(
                    item => item.Initiative_Funder__c === key
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
                              Type__c: CONSTANTS.TYPES.FUNDER_OVERVIEW,
                              Initiative_Funder__c: item.relationId,
                              Description__c: item.value,
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

    // We set an update id when updating and remove when adding
    const [updateId, setUpdateId] = useState(null);
    const [funder, setFunder] = useState(null);

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const {
            Type__c,
            Account__c,
            CurrencyIsoCode,
            Amount__c,
            Approval_Date__c,
            Application_Id__c,
            Grant_Start_Date__c,
            Grant_End_Date__c,
        } = initiative?._funders[updateId] ?? {};

        setValue('Type__c', Type__c);
        setValue('Account__c', Account__c);
        setValue('Contribution', [
            { selectValue: CurrencyIsoCode, textValue: Amount__c },
        ]);
        setValue('Approval_Date__c', Approval_Date__c);
        setValue('GrantDate', {
            from: Grant_Start_Date__c,
            to: Grant_End_Date__c,
        });
        setValue('Application_Id__c', Application_Id__c);
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
    const currentReportDetails = getReportDetails(REPORT_ID);

    return (
        <>
            <TitlePreamble
                title={label(currentItem?.item?.labels?.form?.title)}
                preamble={label(currentItem?.item?.labels?.form?.preamble)}
                preload={!initiative.Id}
            />
            <InputWrapper preload={!initiative.Id}>
                {Object.keys(initiative?._funders).map(funderKey => {
                    const funder = initiative?._funders[funderKey];
                    const reflection = currentReportDetails.filter(
                        item => item.Initiative_Funder__c === funderKey
                    );
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
                            } - ${_get(funder, 'Grant_End_Date__c') || ''} • ${
                                _get(funder, 'Application_Id__c') || ''
                            }`}
                            action={() => {
                                setUpdateId(funderKey);
                                setFunder(funder);
                                setModalIsOpen(true);
                            }}
                            controller={
                                MODE === CONTEXTS.REPORT && controlReflections
                            }
                            name={funderKey}
                            defaultValue={{
                                selected: reflection[0] ?? false ? true : false,
                                value: reflection[0]?.Description__c ?? '',
                            }}
                            inputLabel={label(
                                'custom.FA_ReportWizardFunderReflectionSubHeading'
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
                    {label('custom.FA_ButtonAddFunder')}
                </Button>
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={label('custom.FA_WizardModalHeadingFunders')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty || modalIsSaving}
                onSave={handleSubmit(submit)}>
                <InputWrapper>
                    <Select
                        name="Account__c"
                        label={label('objects.initiativeFunder.Account__c')}
                        subLabel={helpText(
                            'objects.initiativeFunder.Account__c'
                        )}
                        placeholder={label('custom.FA_FormCaptureSelectEmpty')}
                        options={
                            accountFoundations?.records?.map(item => ({
                                label: item.Name,
                                value: item.Id,
                            })) ?? []
                        }
                        disabled={
                            isNovoLeadFunder() &&
                            funder?.Account__c === CONSTANTS.IDS.NNF_ACCOUNT
                        }
                        required
                        controller={control}
                    />
                    <Select
                        name="Type__c"
                        label={label('objects.initiativeFunder.Type__c')}
                        subLabel={helpText('objects.initiativeFunder.Type__c')}
                        placeholder={label('custom.FA_FormCaptureSelectEmpty')}
                        options={valueSet('initiativeFunder.Type__c')}
                        disabled={
                            isNovoLeadFunder() &&
                            funder?.Account__c === CONSTANTS.IDS.NNF_ACCOUNT
                        }
                        controller={control}
                        required
                    />
                    <SelectList
                        name="Contribution"
                        showText
                        label={label('objects.initiativeFunder.Amount__c')}
                        subLabel={helpText(
                            'objects.initiativeFunder.Amount__c'
                        )}
                        selectPlaceholder={label(
                            'custom.FA_FormCaptureSelectEmpty'
                        )}
                        listMaxLength={1}
                        options={[
                            { label: 'DKK', value: 'DKK' },
                            { label: 'EUR', value: 'EUR' },
                        ]}
                        controller={control}
                        disabled={
                            isNovoLeadFunder() &&
                            funder?.Account__c === CONSTANTS.IDS.NNF_ACCOUNT
                        }
                    />
                    <DatePicker
                        name="Approval_Date__c"
                        label={label(
                            'objects.initiativeFunder.Approval_Date__c'
                        )}
                        subLabel={helpText(
                            'objects.initiativeFunder.Approval_Date__c'
                        )}
                        controller={control}
                    />
                    <DateRange
                        name="GrantDate"
                        label={`${label(
                            'objects.initiativeFunder.Grant_Start_Date__c'
                        )} / ${label(
                            'objects.initiativeFunder.Grant_End_Date__c'
                        )}`}
                        controller={control}
                        disabled={
                            isNovoLeadFunder() &&
                            funder?.Account__c === CONSTANTS.IDS.NNF_ACCOUNT
                        }
                    />
                    <Text
                        name="Application_Id__c"
                        label={label(
                            'objects.initiativeFunder.Application_Id__c'
                        )}
                        subLabel={helpText(
                            'objects.initiativeFunder.Application_Id__c'
                        )}
                        label={labelTodo('Application ID number')}
                        placeholder={label(
                            'custom.FA_FormCaptureTextEntryEmpty'
                        )}
                        maxLength={15}
                        disabled={
                            isNovoLeadFunder() &&
                            funder?.Account__c === CONSTANTS.IDS.NNF_ACCOUNT
                        }
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
