// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import { getPermissionRules } from 'utilities';
import {
    useContext,
    useElseware,
    useLabels,
    useReflections,
    useWizardSubmit,
    usePermissions,
} from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import WithPermission from 'components/withPermission';
import Button from 'components/button';
import FunderCard from 'components/_wizard/founderCard';
import WizardModal from 'components/_modals/wizardModal';
import NoReflections from 'components/_wizard/noReflections';
import TitlePreamble from 'components/_wizard/titlePreamble';
import { InputWrapper, FormFields } from 'components/_inputs';

const FundersComponent = ({ pageProps }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { MODE, CONTEXTS, REPORT_ID } = useContext();
    const { label, object, pickList } = useLabels();
    const { ewGet, ewCreateUpdateWrapper } = useElseware();
    const {
        submitMultipleNoReflections,
        submitMultipleReflections,
        getReflectionDefaultValue,
    } = useReflections({
        dataSet() {
            return utilities.funders.getAll;
        },
        parentKey: 'Initiative_Funder__c',
        type: CONSTANTS.REPORT_DETAILS.FUNDER_OVERVIEW,
    });
    const { valuePermissions, enableAction } = usePermissions();

    // ///////////////////
    // STATE
    // ///////////////////

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsSaving, setModalIsSaving] = useState(false);
    const [reflecting, setReflecting] = useState(false);
    const [updateId, setUpdateId] = useState(null);

    // ///////////////////
    // FORMS
    // ///////////////////

    const mainForm = useForm();
    const { isDirty } = useFormState({ control: mainForm.control });
    const reflectionForm = useForm();

    // ///////////////////
    // SUBMIT
    // ///////////////////

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
                Application_Id__c,
            } = formData;

            // Data for sf
            const data = {
                Account__c,
                Type__c,
                Amount__c: Contribution[0]?.textValue,
                CurrencyIsoCode: Contribution[0]?.selectValue,
                Grant_Start_Date__c: GrantDate.from,
                Grant_End_Date__c: GrantDate.to,
                Application_Id__c,
            };

            // Update / Save
            const funderData = await ewCreateUpdateWrapper(
                'initiative-funder/initiative-funder',
                updateId,
                data,
                { Initiative__c: utilities.initiative.get().Id },
                '_funders'
            );

            // Close modal
            setModalIsOpen(false);

            // Modal save button state
            setModalIsSaving(false);

            // Clear content in form
            mainForm.reset();

            // Fold out shit when done if report
            setTimeout(() => {
                if (MODE === CONTEXTS.REPORT) {
                    reflectionForm.setValue(`${funderData.Id}-selector`, true);
                }
            }, 500);
        } catch (error) {
            // Modal save button state
            setModalIsSaving(false);
            console.warn(error);
        }
    }

    // Method: Form error/validation handler
    function error(error) {
        console.warn('Form invalid', error);
        throw error;
    }

    useWizardSubmit({
        [CONTEXTS.REPORT]: [reflectionForm, submitMultipleReflections],
    });

    // ///////////////////
    // DATA
    // ///////////////////

    // Get data for form
    const { data: accountFoundations } = ewGet('account/account', {
        type: 'foundation',
    });

    // Current report details
    const currentReportDetails = utilities.reportDetails.getFromReportId(
        REPORT_ID
    );

    // Get funders
    const funders = utilities.funders.getAll();

    // Check if there is relevant report details yet
    const reportDetailsItems = currentReportDetails.filter(item =>
        funders.map(item => item.Id).includes(item.Initiative_Funder__c)
    );

    // ///////////////////
    // EFFECTS
    // ///////////////////

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const {
            Type__c,
            Account__c,
            CurrencyIsoCode,
            Amount__c,
            Application_Id__c,
            Grant_Start_Date__c,
            Grant_End_Date__c,
        } = utilities.funders.get(updateId);

        mainForm.setValue('Type__c', Type__c);
        mainForm.setValue('Account__c', Account__c);
        mainForm.setValue('Contribution', [
            { selectValue: CurrencyIsoCode, textValue: Amount__c },
        ]);
        mainForm.setValue('GrantDate', {
            from: Grant_Start_Date__c,
            to: Grant_End_Date__c,
        });
        mainForm.setValue('Application_Id__c', Application_Id__c);
    }, [updateId, modalIsOpen]);

    // ///////////////////
    // FIELDS
    // ///////////////////

    const fields = [
        {
            type: 'Select',
            name: 'Account__c',
            label: object.label('Initiative_Funder__c.Account__c'),
            required: true,
            // Type options
            subLabel: object.helpText('Initiative_Funder__c.Account__c'),
            options: accountFoundations
                ? Object.values(accountFoundations?.data).map(item => ({
                      label: item.Name,
                      value: item.Id,
                  }))
                : [],
        },
        {
            type: 'Select',
            name: 'Type__c',
            label: object.label('Initiative_Funder__c.Type__c'),
            required: true,
            // Type options
            subLabel: object.helpText('Initiative_Funder__c.Type__c'),
            options: valuePermissions(
                { 'Lead funder': ['super'] },
                pickList('Initiative_Funder__c.Type__c')
            ),
        },
        {
            type: 'SelectList',
            name: 'Contribution',
            label: object.label('Initiative_Funder__c.Amount__c'),
            // Type options
            showText: true,
            listMaxLength: 1,
            options: [
                { label: 'DKK', value: 'DKK' },
                { label: 'EUR', value: 'EUR' },
            ],
            selectPlaceholder: label('FormCaptureSelectEmpty'),
            subLabel: object.helpText('Initiative_Funder__c.Amount__c'),
        },
        {
            type: 'DateRange',
            name: 'GrantDate',
            label: `${object.label(
                'Initiative_Funder__c.Grant_Start_Date__c'
            )} / ${object.label('Initiative_Funder__c.Grant_End_Date__c')}`,
        },
        {
            type: 'Text',
            name: 'Application_Id__c',
            label: object.label('Initiative_Funder__c.Application_Id__c'),
            // Type options
            maxLength: 15,
            subLabel: object.helpText('Initiative_Funder__c.Application_Id__c'),
        },
    ];

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <WithPermission context>
            <TitlePreamble />
            <InputWrapper>
                <Button
                    theme="teal"
                    className="self-start"
                    action={() => {
                        setUpdateId(null);
                        setModalIsOpen(true);
                    }}>
                    {label('ButtonAddFunder')}
                </Button>
                {MODE === CONTEXTS.REPORT && funders.length > 0 && (
                    <NoReflections
                        {...{
                            onClick: submitMultipleNoReflections,
                            reflectionItems: reportDetailsItems.map(
                                item => item.Description__c
                            ),
                            reflecting,
                        }}
                    />
                )}
                {funders.map(funder => {
                    const reflection = currentReportDetails.find(
                        item => item.Initiative_Funder__c === funder.Id
                    );
                    return (
                        <FunderCard
                            key={funder.Id}
                            headline={_get(funder, 'Account__r.Name') || ''}
                            label={_get(funder, 'Type__c') || ''}
                            subHeadline={`${
                                _get(funder, 'CurrencyIsoCode') || ''
                            } ${_get(funder, 'Amount__c') || ''}`}
                            footnote={`${
                                _get(funder, 'Grant_Start_Date__c') || ''
                            } - ${_get(funder, 'Grant_End_Date__c') || ''} ??? ${
                                _get(funder, 'Application_Id__c') || ''
                            }`}
                            action={enableAction(
                                [
                                    getPermissionRules(
                                        'initiative',
                                        'funders',
                                        'update'
                                    ),
                                    { account: funder.Account__c },
                                ],
                                () => {
                                    setUpdateId(funder.Id);
                                    setModalIsOpen(true);
                                }
                            )}
                            reflectAction={setReflecting}
                            controller={
                                MODE === CONTEXTS.REPORT &&
                                reflectionForm.control
                            }
                            name={funder.Id}
                            defaultValue={getReflectionDefaultValue(reflection)}
                            inputLabel={label(
                                'ReportWizardFunderReflectionSubHeading'
                            )}
                        />
                    );
                })}
            </InputWrapper>
            <WizardModal
                isOpen={modalIsOpen}
                title={label('WizardModalHeadingFunders')}
                onCancel={() => setModalIsOpen(false)}
                isSaving={modalIsSaving}
                onSave={mainForm.handleSubmit(submit)}>
                <InputWrapper>
                    <FormFields
                        {...{
                            fields,
                            form: mainForm,
                        }}
                    />
                </InputWrapper>
            </WizardModal>
        </WithPermission>
    );
};

FundersComponent.propTypes = {};

FundersComponent.defaultProps = {};

FundersComponent.layout = 'wizard';

export default WithAuth(FundersComponent);
