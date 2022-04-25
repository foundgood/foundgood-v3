// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import { useAuth, useMetadata, useElseware, useContext } from 'utilities/hooks';
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
    // ///////////////////
    // AUTH
    // ///////////////////

    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // ///////////////////
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { MODE, CONTEXTS, REPORT_ID } = useContext();
    const { label, helpText, valueSet } = useMetadata();
    const { ewGet, ewCreate, ewCreateUpdateWrapper } = useElseware();

    // ///////////////////
    // ///////////////////
    // STORES
    // ///////////////////

    const {
        initiative,
        getReportDetails,
        updateInitiativeData,
        isNovoLeadFunder,
        CONSTANTS,
    } = useInitiativeDataStore();

    const { setCurrentSubmitHandler, currentItem } = useWizardNavigationStore();

    // ///////////////////
    // ///////////////////
    // STATE
    // ///////////////////
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsSaving, setModalIsSaving] = useState(false);
    const [reflecting, setReflecting] = useState(false);
    const [updateId, setUpdateId] = useState(null);
    const [funder, setFunder] = useState(null);

    // ///////////////////
    // ///////////////////
    // FORMS
    // ///////////////////

    const mainForm = useForm();
    const { isDirty } = useFormState({ control: mainForm.control });
    const reflectionForm = useForm();

    // ///////////////////
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

        // Create or update report detail based on reformatted form data
        // Update if reportDetailId exist in item - this means we have it already in the store
        await Promise.all(
            reportDetails.map(item =>
                ewCreateUpdateWrapper(
                    'initiative-report-detail/initiative-report-detail',
                    item.reportDetailId,
                    {
                        Description__c: item.value,
                    },
                    {
                        Type__c: CONSTANTS.TYPES.FUNDER_OVERVIEW,
                        Initiative_Funder__c: item.relationId,
                        Initiative_Report__c: REPORT_ID,
                    },
                    '_reportDetails'
                )
            )
        );
    }

    // Method: Submits no reflections flag
    async function submitNoReflections() {
        // Create or update report detail ids based on reformatted form data
        // Update if reportDetailId exist in item - this means we have it already in the store
        await Promise.all(
            Object.values(initiative?._funders).map(async item => {
                const { data: reportDetailsData } = await ewCreate(
                    'initiative-report-detail/initiative-report-detail',
                    {
                        Type__c: CONSTANTS.TYPES.FUNDER_OVERVIEW,
                        Initiative_Funder__c: item.Id,
                        Description__c: CONSTANTS.CUSTOM.NO_REFLECTIONS,
                        Initiative_Report__c: REPORT_ID,
                    }
                );
                updateInitiativeData('_reportDetails', reportDetailsData);
            })
        );
    }

    // Method: Form error/validation handler
    function error(error) {
        console.warn('Form invalid', error);
        throw error;
    }

    // ///////////////////
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
        } = initiative?._funders[updateId] ?? {};

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
        if (MODE === CONTEXTS.REPORT) {
            setTimeout(() => {
                setCurrentSubmitHandler(
                    reflectionForm.handleSubmit(submitReflections, error)
                );
            }, 100);
        } else {
            setTimeout(() => {
                setCurrentSubmitHandler(null);
            }, 100);
        }
    }, [initiative]);

    // ///////////////////
    // ///////////////////
    // DATA
    // ///////////////////

    // Get data for form
    const { data: accountFoundations } = ewGet('account/account', {
        type: 'foundation',
    });

    // Current report details
    const currentReportDetails = getReportDetails(REPORT_ID);

    // Check if there is relevant report details yet
    const reportDetailsItems = currentReportDetails.filter(item =>
        Object.keys(initiative?._funders).includes(item.Initiative_Funder__c)
    );

    // ///////////////////
    // ///////////////////
    // FIELDS
    // ///////////////////

    const fields = [
        {
            type: 'Select',
            name: 'Account__c',
            label: label('objects.initiativeFunder.Account__c'),
            disabled:
                isNovoLeadFunder() &&
                funder?.Account__c === CONSTANTS.IDS.NNF_ACCOUNT,
            required: true,
            // Type options
            subLabel: helpText('objects.initiativeFunder.Account__c'),
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
            label: label('objects.initiativeFunder.Type__c'),
            disabled:
                isNovoLeadFunder() &&
                funder?.Account__c === CONSTANTS.IDS.NNF_ACCOUNT,
            required: true,
            // Type options
            subLabel: helpText('objects.initiativeFunder.Type__c'),
            options: valueSet('initiativeFunder.Type__c'),
        },
        {
            type: 'SelectList',
            name: 'Contribution',
            label: label('objects.initiativeFunder.Amount__c'),
            disabled:
                isNovoLeadFunder() &&
                funder?.Account__c === CONSTANTS.IDS.NNF_ACCOUNT,
            // Type options
            showText: true,
            listMaxLength: 1,
            options: [
                { label: 'DKK', value: 'DKK' },
                { label: 'EUR', value: 'EUR' },
            ],
            selectPlaceholder: label('custom.FA_FormCaptureSelectEmpty'),
            subLabel: helpText('objects.initiativeFunder.Amount__c'),
        },
        {
            type: 'DateRange',
            name: 'GrantDate',
            label: `${label(
                'objects.initiativeFunder.Grant_Start_Date__c'
            )} / ${label('objects.initiativeFunder.Grant_End_Date__c')}`,
            disabled:
                isNovoLeadFunder() &&
                funder?.Account__c === CONSTANTS.IDS.NNF_ACCOUNT,
        },
        {
            type: 'Text',
            name: 'Application_Id__c',
            label: label('objects.initiativeFunder.Application_Id__c'),
            disabled:
                isNovoLeadFunder() &&
                funder?.Account__c === CONSTANTS.IDS.NNF_ACCOUNT,
            // Type options
            maxLength: 15,
            subLabel: helpText('objects.initiativeFunder.Application_Id__c'),
        },
    ];

    return (
        <>
            <TitlePreamble
                title={label(currentItem?.item?.labels?.form?.title)}
                preamble={label(currentItem?.item?.labels?.form?.preamble)}
                preload={!initiative.Id}
            />
            <InputWrapper preload={!initiative.Id}>
                <RenderNoReflections
                    {...{
                        MODE,
                        CONTEXTS,
                        initiative,
                        submitNoReflections,
                        reportDetailsItems,
                        reflecting,
                    }}
                />
                <RenderFunderCard
                    {...{
                        MODE,
                        CONTEXTS,
                        CONSTANTS,
                        initiative,
                        currentReportDetails,
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
                    {label('custom.FA_ButtonAddFunder')}
                </Button>
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={label('custom.FA_WizardModalHeadingFunders')}
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

const RenderNoReflections = ({
    MODE,
    CONTEXTS,
    initiative,
    submitNoReflections,
    reportDetailsItems,
    reflecting,
}) =>
    MODE === CONTEXTS.REPORT &&
    Object.values(initiative?._funders).length > 0 && (
        <NoReflections
            onClick={submitNoReflections}
            reflectionItems={reportDetailsItems.map(
                item => item.Description__c
            )}
            reflecting={reflecting}
        />
    );

const RenderFunderCard = ({
    MODE,
    CONTEXTS,
    CONSTANTS,
    initiative,
    currentReportDetails,
    setUpdateId,
    setFunder,
    setModalIsOpen,
    setReflecting,
    reflectionForm,
    label,
}) =>
    Object.keys(initiative?._funders).map(funderKey => {
        const funder = initiative?._funders[funderKey];
        const reflection = currentReportDetails.filter(
            item => item.Initiative_Funder__c === funderKey
        );

        return (
            <FunderCard
                key={funderKey}
                headline={_get(funder, 'Account__r.Name') || ''}
                label={_get(funder, 'Type__c') || ''}
                subHeadline={`${_get(funder, 'CurrencyIsoCode') || ''} ${
                    _get(funder, 'Amount__c') || ''
                }`}
                footnote={`${_get(funder, 'Grant_Start_Date__c') || ''} - ${
                    _get(funder, 'Grant_End_Date__c') || ''
                } • ${_get(funder, 'Application_Id__c') || ''}`}
                action={() => {
                    setUpdateId(funderKey);
                    setFunder(funder);
                    setModalIsOpen(true);
                }}
                reflectAction={setReflecting}
                controller={MODE === CONTEXTS.REPORT && reflectionForm.control}
                name={funderKey}
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
                inputLabel={label(
                    'custom.FA_ReportWizardFunderReflectionSubHeading'
                )}
            />
        );
    });

FundersComponent.propTypes = {};

FundersComponent.defaultProps = {};

FundersComponent.layout = 'wizard';

export default FundersComponent;
