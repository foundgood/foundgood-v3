// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState, useWatch } from 'react-hook-form';
import _get from 'lodash.get';
import dayjs from 'dayjs';

// Utilities
import {
    useContext,
    useElseware,
    useLabels,
    useReflections,
    useWizardSubmit,
} from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import WithPermission from 'components/withPermission';
import TitlePreamble from 'components/_wizard/titlePreamble';
import Button from 'components/button';
import WizardModal from 'components/wizardModal';
import { InputWrapper, Select, SelectList, Text } from 'components/_inputs';
import ResultCard from 'components/_wizard/resultCard';
import NoReflections from 'components/_wizard/noReflections';

const SharingResultsComponent = ({ pageProps }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { MODE, CONTEXTS, REPORT_ID } = useContext();
    const { getValueLabel, pickList, label, object } = useLabels();
    const { ewCreateUpdateWrapper } = useElseware();
    const {
        submitMultipleNoReflections,
        submitMultipleReflections,
        getReflectionDefaultValue,
    } = useReflections({
        dataSet() {
            return utilities.activities.getTypeDissemination;
        },
        parentKey: 'Initiative_Activity__c',
        type: CONSTANTS.REPORT_DETAILS.ACTIVITY_OVERVIEW,
    });

    // ///////////////////
    // STATE
    // ///////////////////

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsSaving, setModalIsSaving] = useState(false);
    const [reflecting, setReflecting] = useState(false);
    const [updateId, setUpdateId] = useState(null);
    const [disseminationType, setDisseminationType] = useState(null);

    // ///////////////////
    // FORMS
    // ///////////////////

    const mainForm = useForm();
    const reflectionForm = useForm();
    const { isDirty } = useFormState({ control: mainForm.control });
    const disseminationTypeSelect = useWatch({
        control: mainForm.control,
        name: 'Dissemination_Method__c',
    });

    // ///////////////////
    // SUBMIT
    // ///////////////////

    async function submit(formData) {
        // Modal save button state
        setModalIsSaving(true);
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

            // Data for sf
            const data = {
                Activity_Type__c: CONSTANTS.ACTIVITIES.ACTIVITY_DISSEMINATION,

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
            const activityData = await ewCreateUpdateWrapper(
                'initiative-activity/initiative-activity',
                updateId,
                data,
                { Initiative__c: utilities.initiative.get().Id },
                '_activities'
            );

            // Close modal
            setModalIsOpen(false);

            // Modal save button state
            setModalIsSaving(false);

            // Clear content in form
            mainForm.reset();

            // Fold out shit when done if report
            // setValue: reflectionForm.setValue,
            setTimeout(() => {
                if (MODE === CONTEXTS.REPORT) {
                    reflectionForm.setValue(
                        `${activityData.Id}-selector`,
                        true
                    );
                }
            }, 500);
        } catch (error) {
            // Modal save button state
            setModalIsSaving(false);
            console.warn(error);
        }
    }

    useWizardSubmit({
        [CONTEXTS.REPORT]: [reflectionForm, submitMultipleReflections],
    });

    // ///////////////////
    // METHODS
    // ///////////////////

    // Array of years - Publication year
    const getYears = () => {
        const years = [];
        const currentYear = new Date().getFullYear();
        let startYear = currentYear - 10; // 10 years back
        while (startYear <= currentYear) {
            const year = startYear++;
            years.push({
                label: `${year}`,
                value: `${year}-01-01`,
            });
        }
        return years;
    };

    // ///////////////////
    // DATA
    // ///////////////////

    // Current report details
    const currentReportDetails = utilities.reportDetails.getFromReportId(
        REPORT_ID
    );

    // Check if there is relevant report details yet
    const reportDetailsItems = currentReportDetails.filter(item =>
        utilities.activities
            .getTypeDissemination()
            .map(item => item.Id)
            .includes(item.Initiative_Activity__c)
    );

    // Get activities
    const activities = utilities.activities.getTypeDissemination();

    // ///////////////////
    // EFFECTS
    // ///////////////////

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
        } = utilities.activities.get(updateId);

        mainForm.setValue('Things_To_Do__c', Things_To_Do__c);
        mainForm.setValue('Dissemination_Method__c', Dissemination_Method__c);
        mainForm.setValue(
            'Audience_Tag__c',
            Audience_Tag__c?.split(';').map(value => ({
                selectValue: value,
            }))
        );

        mainForm.setValue('Publication_Type__c', Publication_Type__c);
        mainForm.setValue('Publication_Year__c', Publication_Year__c);
        mainForm.setValue('Publication_Title__c', Publication_Title__c);
        mainForm.setValue('Publication_Publisher__c', Publication_Publisher__c);
        mainForm.setValue('Publication_Author__c', Publication_Author__c);
        mainForm.setValue('Publication_DOI__c', Publication_DOI__c);

        // Set dissemination type
        setDisseminationType(Dissemination_Method__c);
    }, [updateId, modalIsOpen]);

    // Watch the change of goal type
    useEffect(() => {
        setDisseminationType(disseminationTypeSelect);
    }, [disseminationTypeSelect]);

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
                    {label('ButtonAddResult')}
                </Button>
                {MODE === CONTEXTS.REPORT && activities.length > 0 && (
                    <NoReflections
                        onClick={submitMultipleNoReflections}
                        reflectionItems={reportDetailsItems.map(
                            item => item.Description__c
                        )}
                        reflecting={reflecting}
                    />
                )}
                {activities.map(activity => {
                    const headline = _get(activity, 'Things_To_Do__c') || '';

                    const footnote = `${
                        getValueLabel(
                            'Initiative_Activity__c.Dissemination_Method__c',
                            _get(activity, 'Dissemination_Method__c')
                        ) || ''
                    } ${
                        activity.Dissemination_Method__c &&
                        activity.KPI_Category__c
                            ? '•'
                            : ''
                    } ${_get(activity, 'KPI_Category__c') || ''}`;

                    const tagsString = activity?.Audience_Tag__c ?? null;
                    const tags = tagsString
                        ? tagsString
                              .split(';')
                              .map(tag =>
                                  getValueLabel(
                                      'Initiative_Activity__c.Audience_Tag__c',
                                      tag
                                  )
                              )
                        : [];

                    const reflection = currentReportDetails.find(
                        item => item.Initiative_Activity__c === activity.Id
                    );

                    const showJournalPublication =
                        activity.Dissemination_Method__c ===
                        CONSTANTS.ACTIVITIES.ACTIVITY_JOURNAL;

                    return (
                        <ResultCard
                            key={activity.Id}
                            headline={headline}
                            footnote={footnote}
                            tags={tags}
                            action={() => {
                                setUpdateId(activity.Id);
                                setModalIsOpen(true);
                            }}
                            reflectAction={setReflecting}
                            controller={
                                MODE === CONTEXTS.REPORT &&
                                reflectionForm.control
                            }
                            name={activity.Id}
                            defaultValue={getReflectionDefaultValue(reflection)}
                            journalPublication={
                                showJournalPublication
                                    ? {
                                          type: activity.Publication_Type__c,
                                          year: dayjs(
                                              activity.Publication_Year__c
                                          ).format('YYYY'),
                                          title: activity.Publication_Title__c,
                                          publisher:
                                              activity.Publication_Publisher__c,
                                          author:
                                              activity.Publication_Author__c,
                                          doi: activity.Publication_DOI__c,
                                      }
                                    : null
                            }
                            input={label(
                                'ReportWizardSharingReflectionSubHeading'
                            )}
                        />
                    );
                })}
            </InputWrapper>
            <WizardModal
                isOpen={modalIsOpen}
                title={label('WizardModalHeadingSharing')}
                onCancel={() => setModalIsOpen(false)}
                isSaving={!isDirty || modalIsSaving}
                onSave={mainForm.handleSubmit(submit)}>
                <InputWrapper>
                    <Text
                        name="Things_To_Do__c"
                        label={object.label(
                            'Initiative_Activity__c.Things_To_Do__c'
                        )}
                        subLabel={object.helpText(
                            'Initiative_Activity__c.Things_To_Do__c'
                        )}
                        placeholder={label('FormCaptureTextEntryEmpty')}
                        maxLength={200}
                        controller={mainForm.control}
                        required
                    />

                    <Select
                        name="Dissemination_Method__c"
                        label={object.label(
                            'Initiative_Activity__c.Dissemination_Method__c'
                        )}
                        subLabel={object.helpText(
                            'Initiative_Activity__c.Dissemination_Method__c'
                        )}
                        placeholder={label('FormCaptureSelectEmpty')}
                        options={pickList(
                            'Initiative_Activity__c.Dissemination_Method__c'
                        )}
                        controller={mainForm.control}
                        required
                    />

                    <SelectList
                        name="Audience_Tag__c"
                        label={object.label(
                            'Initiative_Activity__c.Audience_Tag__c'
                        )}
                        subLabel={object.helpText(
                            'Initiative_Activity__c.Audience_Tag__c'
                        )}
                        selectPlaceholder={label('FormCaptureSelectEmpty')}
                        options={pickList(
                            'Initiative_Activity__c.Audience_Tag__c'
                        )}
                        listMaxLength={4}
                        controller={mainForm.control}
                        buttonLabel={label('ButtonAddAudienceTag')}
                        required
                    />

                    {/* Predefined goal */}
                    {disseminationType ===
                        CONSTANTS.ACTIVITIES.ACTIVITY_JOURNAL && (
                        <>
                            <Text
                                name="Publication_Type__c"
                                label={object.label(
                                    'Initiative_Activity__c.Publication_Type__c'
                                )}
                                subLabel={object.helpText(
                                    'Initiative_Activity__c.Publication_Type__c'
                                )}
                                placeholder={label('FormCaptureTextEntryEmpty')}
                                maxLength={30}
                                controller={mainForm.control}
                            />

                            <Select
                                name="Publication_Year__c"
                                label={object.label(
                                    'Initiative_Activity__c.Publication_Year__c'
                                )}
                                subLabel={object.helpText(
                                    'Initiative_Activity__c.Publication_Year__c'
                                )}
                                options={getYears()}
                                controller={mainForm.control}
                            />
                            <Text
                                name="Publication_Title__c"
                                label={object.label(
                                    'Initiative_Activity__c.Publication_Title__c'
                                )}
                                subLabel={object.helpText(
                                    'Initiative_Activity__c.Publication_Title__c'
                                )}
                                placeholder={label('FormCaptureTextEntryEmpty')}
                                maxLength={200}
                                controller={mainForm.control}
                            />
                            <Text
                                name="Publication_Publisher__c"
                                label={object.label(
                                    'Initiative_Activity__c.Publication_Publisher__c'
                                )}
                                subLabel={object.helpText(
                                    'Initiative_Activity__c.Publication_Publisher__c'
                                )}
                                placeholder={label('FormCaptureTextEntryEmpty')}
                                maxLength={200}
                                controller={mainForm.control}
                            />
                            <Text
                                name="Publication_Author__c"
                                label={object.label(
                                    'Initiative_Activity__c.Publication_Author__c'
                                )}
                                subLabel={object.helpText(
                                    'Initiative_Activity__c.Publication_Author__c'
                                )}
                                placeholder={label('FormCaptureTextEntryEmpty')}
                                maxLength={80}
                                controller={mainForm.control}
                            />
                            <Text
                                name="Publication_DOI__c"
                                label={object.label(
                                    'Initiative_Activity__c.Publication_DOI__c'
                                )}
                                subLabel={object.helpText(
                                    'Initiative_Activity__c.Publication_DOI__c'
                                )}
                                placeholder={label('FormCaptureTextEntryEmpty')}
                                maxLength={30}
                                controller={mainForm.control}
                            />
                        </>
                    )}
                </InputWrapper>
            </WizardModal>
        </WithPermission>
    );
};

SharingResultsComponent.propTypes = {};

SharingResultsComponent.defaultProps = {};

SharingResultsComponent.layout = 'wizard';

export default WithAuth(SharingResultsComponent);
