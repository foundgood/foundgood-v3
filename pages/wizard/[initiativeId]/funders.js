// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import {
    useAuth,
    useLabels,
    useElseware,
    useContext,
    useReflections,
} from 'utilities/hooks';
import {
    useInitiativeDataStore,
    useWizardNavigationStore,
} from 'utilities/store';

// Components
import Button from 'components/button';
import FunderCard from 'components/_wizard/founderCard';
import Modal from 'components/modal';
import NoReflections from 'components/_wizard/noReflections';
import TitlePreamble from 'components/_wizard/titlePreamble';
import { InputWrapper, FormFields } from 'components/_inputs';

const FundersComponent = ({ pageProps }) => {
    // ///////////////////
    // AUTH
    // ///////////////////

    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // ///////////////////
    // STORES
    // ///////////////////

    const { initiative, utilities, CONSTANTS } = useInitiativeDataStore();
    const { setCurrentSubmitHandler, currentItem } = useWizardNavigationStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { MODE, CONTEXTS, REPORT_ID } = useContext();
    const { label, object, valueSet } = useLabels();
    const { ewGet, ewCreateUpdateWrapper } = useElseware();
    const {
        submitMultipleNoReflections,
        submitMultipleReflections,
    } = useReflections({
        dataSet() {
            return utilities.funders.getAll;
        },
        parentKey: 'Initiative_Funder__c',
        type: CONSTANTS.REPORT_DETAILS.FUNDER_OVERVIEW,
    });

    // ///////////////////
    // STATE
    // ///////////////////

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsSaving, setModalIsSaving] = useState(false);
    const [reflecting, setReflecting] = useState(false);
    const [updateId, setUpdateId] = useState(null);
    const [funder, setFunder] = useState(null);

    // ///////////////////
    // FORMS
    // ///////////////////

    const mainForm = useForm();
    const { isDirty } = useFormState({ control: mainForm.control });
    const reflectionForm = useForm();

    // ///////////////////
    // METHODS
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
                { Initiative__c: initiative.Id },
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

    // Effect: Add submit handler to wizard navigation store
    useEffect(() => {
        setTimeout(() => {
            setCurrentSubmitHandler(
                MODE === CONTEXTS.REPORT
                    ? reflectionForm.handleSubmit(
                          submitMultipleReflections,
                          error
                      )
                    : null
            );
        }, 100);
    }, [initiative]);

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

    // Check if there is relevant report details yet
    const reportDetailsItems = currentReportDetails.filter(item =>
        utilities.funders
            .getAll()
            .map(item => item.Id)
            .includes(item.Initiative_Funder__c)
    );

    // Get funders
    const funders = utilities.funders.getAll();

    // ///////////////////
    // FIELDS
    // ///////////////////

    const fields = [
        {
            type: 'Select',
            name: 'Account__c',
            label: object.label('Initiative_Funder__c.Account__c'),
            disabled:
                utilities.isNovoLeadFunder() &&
                funder?.Account__c === CONSTANTS.IDS.NNF_ACCOUNT,
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
            disabled:
                utilities.isNovoLeadFunder() &&
                funder?.Account__c === CONSTANTS.IDS.NNF_ACCOUNT,
            required: true,
            // Type options
            subLabel: object.helpText('Initiative_Funder__c.Type__c'),
            options: valueSet('initiativeFunder.Type__c'),
        },
        {
            type: 'SelectList',
            name: 'Contribution',
            label: object.label('Initiative_Funder__c.Amount__c'),
            disabled:
                utilities.isNovoLeadFunder() &&
                funder?.Account__c === CONSTANTS.IDS.NNF_ACCOUNT,
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
            disabled:
                utilities.isNovoLeadFunder() &&
                funder?.Account__c === CONSTANTS.IDS.NNF_ACCOUNT,
        },
        {
            type: 'Text',
            name: 'Application_Id__c',
            label: object.label('Initiative_Funder__c.Application_Id__c'),
            disabled:
                utilities.isNovoLeadFunder() &&
                funder?.Account__c === CONSTANTS.IDS.NNF_ACCOUNT,
            // Type options
            maxLength: 15,
            subLabel: object.helpText('Initiative_Funder__c.Application_Id__c'),
        },
    ];

    return (
        <>
            <TitlePreamble />
            <InputWrapper>
                {MODE === CONTEXTS.REPORT && funders.length > 0 && (
                    <NoReflections
                        onClick={submitMultipleNoReflections}
                        reflectionItems={reportDetailsItems.map(
                            item => item.Description__c
                        )}
                        reflecting={reflecting}
                    />
                )}
                <RenderFunderCard
                    {...{
                        MODE,
                        CONTEXTS,
                        CONSTANTS,
                        currentReportDetails,
                        funders,
                        setUpdateId,
                        setFunder,
                        setModalIsOpen,
                        setReflecting,
                        reflectionForm,
                        label,
                    }}
                />
                <Button
                    theme="teal"
                    className="self-start"
                    action={() => {
                        setUpdateId(null);
                        setModalIsOpen(true);
                    }}>
                    {label('ButtonAddFunder')}
                </Button>
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={label('WizardModalHeadingFunders')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty || modalIsSaving}
                onSave={mainForm.handleSubmit(submit)}>
                <InputWrapper>
                    <FormFields
                        {...{
                            fields,
                            form: mainForm,
                        }}
                    />
                </InputWrapper>
            </Modal>
        </>
    );
};

// ///////////////////
// ///////////////////
// LOCAL COMPONENTS
// ///////////////////

const RenderFunderCard = ({
    MODE,
    CONTEXTS,
    CONSTANTS,
    currentReportDetails,
    funders,
    setUpdateId,
    setFunder,
    setModalIsOpen,
    setReflecting,
    reflectionForm,
    label,
}) =>
    funders.map(funder => {
        const reflection = currentReportDetails.filter(
            item => item.Initiative_Funder__c === funder.Id
        );

        return (
            <FunderCard
                key={funder.Id}
                headline={_get(funder, 'Account__r.Name') || ''}
                label={_get(funder, 'Type__c') || ''}
                subHeadline={`${_get(funder, 'CurrencyIsoCode') || ''} ${
                    _get(funder, 'Amount__c') || ''
                }`}
                footnote={`${_get(funder, 'Grant_Start_Date__c') || ''} - ${
                    _get(funder, 'Grant_End_Date__c') || ''
                } • ${_get(funder, 'Application_Id__c') || ''}`}
                action={() => {
                    setUpdateId(funder.Id);
                    setFunder(funder);
                    setModalIsOpen(true);
                }}
                reflectAction={setReflecting}
                controller={MODE === CONTEXTS.REPORT && reflectionForm.control}
                name={funder.Id}
                defaultValue={{
                    selected:
                        reflection[0] &&
                        (reflection[0]?.Description__c !==
                            CONSTANTS.CUSTOM.NO_REFLECTIONS ??
                            false),
                    value:
                        reflection[0]?.Description__c ===
                        CONSTANTS.CUSTOM.NO_REFLECTIONS
                            ? ''
                            : reflection[0]?.Description__c,
                }}
                inputLabel={label('ReportWizardFunderReflectionSubHeading')}
            />
        );
    });

FundersComponent.propTypes = {};

FundersComponent.defaultProps = {};

FundersComponent.layout = 'wizard';

export default FundersComponent;
