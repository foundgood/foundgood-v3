// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState, useWatch } from 'react-hook-form';
import _get from 'lodash.get';
import dayjs from 'dayjs';

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
    DatePicker,
} from 'components/_inputs';
import ResultCard from 'components/_wizard/resultCard';
import NoReflections from 'components/_wizard/noReflections';

const SharingResultsComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo, valueSet, log, label, helpText } = useMetadata();

    // Context for wizard pages
    const { MODE, CONTEXTS, UPDATE, REPORT_ID } = useContext();

    // Hook: useForm setup
    const { handleSubmit, control, setValue, reset } = useForm();
    const {
        handleSubmit: handleSubmitReflections,
        control: controlReflections,
    } = useForm();
    const { isDirty } = useFormState({ control });
    const disseminationTypeSelect = useWatch({
        control,
        name: 'Dissemination_Method__c',
    });

    // Hook: Salesforce setup
    const { sfCreate, sfUpdate, sfQuery, queries } = useSalesForce();

    // Store: Initiative data
    const {
        initiative,
        getReportDetails,
        updateActivity,
        updateReportDetails,
        CONSTANTS,
    } = useInitiativeDataStore();

    // Store: Wizard navigation
    const { setCurrentSubmitHandler, currentItem } = useWizardNavigationStore();

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

    // Method: Adds founder to sf and updates founder list in view
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
                ? await sfUpdate({ object, data, id: updateId })
                : await sfCreate({
                      object,
                      data: { ...data, Initiative__c: initiative.Id },
                  });

            // Update store
            await updateActivity(activityId);

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
        const reportDetails = Object.keys(initiative?._activities)
            .reduce((acc, key) => {
                // Does the reflection relation exist already?
                const currentReflection = currentReportDetails.filter(
                    item => item.Initiative_Activity__c === key
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
                              Type__c: CONSTANTS.TYPES.ACTIVITY_OVERVIEW,
                              Initiative_Activity__c: item.relationId,
                              Description__c: item.value,
                              Initiative_Report__c: REPORT_ID,
                          },
                      })
            )
        );

        // Bulk update affected activity goals
        await updateReportDetails(reportDetailIds);
    }

    // Method: Submits no reflections flag
    async function submitNoReflections() {
        // Object name
        const object = 'Initiative_Report_Detail__c';

        // Create or update report detail ids based on reformatted form data
        // Update if reportDetailId exist in item - this means we have it already in the store
        const reportDetailIds = await Promise.all(
            Object.values(initiative?._activities)
                .filter(
                    item =>
                        item.Activity_Type__c ===
                        CONSTANTS.TYPES.ACTIVITY_DISSEMINATION
                )
                .map(activity =>
                    sfCreate({
                        object,
                        data: {
                            Type__c: CONSTANTS.TYPES.ACTIVITY_OVERVIEW,
                            Initiative_Activity__c: activity.Id,
                            Description__c: CONSTANTS.CUSTOM.NO_REFLECTIONS,
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

    // Local state to handle reflection
    const [reflecting, setReflecting] = useState(false);

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

    // Check if there is relevant report details yet
    const reportDetailsItems = currentReportDetails
        .filter(item =>
            Object.keys(initiative?._activities).includes(
                item.Initiative_Activity__c
            )
        )
        .filter(item => {
            // Activity
            const activity =
                initiative?._activities[item.Initiative_Activity__c];
            return (
                activity.Activity_Type__c ===
                CONSTANTS.TYPES.ACTIVITY_DISSEMINATION
            );
        });

    return (
        <>
            <TitlePreamble
                title={label(currentItem?.item?.labels?.form?.title)}
                preamble={label(currentItem?.item?.labels?.form?.preamble)}
                preload={!initiative.Id}
            />
            <InputWrapper preload={!initiative.Id}>
                {MODE === CONTEXTS.REPORT && (
                    <NoReflections
                        onClick={submitNoReflections}
                        reflectionItems={reportDetailsItems.map(
                            item => item.Description__c
                        )}
                        reflecting={reflecting}
                    />
                )}
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

                        const reflection = currentReportDetails.filter(
                            item => item.Initiative_Activity__c === activityKey
                        );

                        const showJournalPublication =
                            activity.Dissemination_Method__c ===
                            CONSTANTS.TYPES.ACTIVITY_JOURNAL;

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
                                reflectAction={setReflecting}
                                controller={
                                    MODE === CONTEXTS.REPORT &&
                                    controlReflections
                                }
                                name={activityKey}
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
                                journalPublication={
                                    showJournalPublication
                                        ? {
                                              type:
                                                  activity.Publication_Type__c,
                                              year: dayjs(
                                                  activity.Publication_Year__c
                                              ).format('YYYY'),
                                              title:
                                                  activity.Publication_Title__c,
                                              publisher:
                                                  activity.Publication_Publisher__c,
                                              author:
                                                  activity.Publication_Author__c,
                                              doi: activity.Publication_DOI__c,
                                          }
                                        : null
                                }
                                input={label(
                                    'custom.FA_ReportWizardSharingReflectionSubHeading'
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
                    {label('custom.FA_ButtonAddResult')}
                </Button>
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={label('custom.FA_WizardModalHeadingSharing')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty || modalIsSaving}
                onSave={handleSubmit(submit)}>
                <InputWrapper>
                    <Text
                        name="Things_To_Do__c"
                        label={label(
                            'objects.initiativeActivity.Things_To_Do__c'
                        )}
                        subLabel={helpText(
                            'objects.initiativeActivity.Things_To_Do__c'
                        )}
                        placeholder={label(
                            'custom.FA_FormCaptureTextEntryEmpty'
                        )}
                        maxLength={200}
                        controller={control}
                        required
                    />

                    <Select
                        name="Dissemination_Method__c"
                        label={label(
                            'objects.initiativeActivity.Dissemination_Method__c'
                        )}
                        subLabel={helpText(
                            'objects.initiativeActivity.Dissemination_Method__c'
                        )}
                        placeholder={label('custom.FA_FormCaptureSelectEmpty')}
                        options={valueSet(
                            'initiativeActivity.Dissemination_Method__c'
                        )}
                        controller={control}
                        required
                    />

                    <SelectList
                        name="Audience_Tag__c"
                        label={label(
                            'objects.initiativeActivity.Audience_Tag__c'
                        )}
                        subLabel={helpText(
                            'objects.initiativeActivity.Audience_Tag__c'
                        )}
                        selectPlaceholder={label(
                            'custom.FA_FormCaptureSelectEmpty'
                        )}
                        options={valueSet('initiativeActivity.Audience_Tag__c')}
                        listMaxLength={4}
                        controller={control}
                        buttonLabel={label('custom.FA_ButtonAddAudienceTag')}
                        required
                    />

                    {/* Predefined goal */}
                    {disseminationType === CONSTANTS.TYPES.ACTIVITY_JOURNAL && (
                        <>
                            <Text
                                name="Publication_Type__c"
                                label={label(
                                    'objects.initiativeActivity.Publication_Type__c'
                                )}
                                subLabel={helpText(
                                    'objects.initiativeActivity.Publication_Type__c'
                                )}
                                placeholder={label(
                                    'custom.FA_FormCaptureTextEntryEmpty'
                                )}
                                maxLength={30}
                                controller={control}
                            />

                            <Select
                                name="Publication_Year__c"
                                label={label(
                                    'objects.initiativeActivity.Publication_Year__c'
                                )}
                                subLabel={helpText(
                                    'objects.initiativeActivity.Publication_Year__c'
                                )}
                                options={getYears()}
                                controller={control}
                            />
                            <Text
                                name="Publication_Title__c"
                                label={label(
                                    'objects.initiativeActivity.Publication_Title__c'
                                )}
                                subLabel={helpText(
                                    'objects.initiativeActivity.Publication_Title__c'
                                )}
                                placeholder={label(
                                    'custom.FA_FormCaptureTextEntryEmpty'
                                )}
                                maxLength={200}
                                controller={control}
                            />
                            <Text
                                name="Publication_Publisher__c"
                                label={label(
                                    'objects.initiativeActivity.Publication_Publisher__c'
                                )}
                                subLabel={helpText(
                                    'objects.initiativeActivity.Publication_Publisher__c'
                                )}
                                placeholder={label(
                                    'custom.FA_FormCaptureTextEntryEmpty'
                                )}
                                maxLength={200}
                                controller={control}
                            />
                            <Text
                                name="Publication_Author__c"
                                label={label(
                                    'objects.initiativeActivity.Publication_Author__c'
                                )}
                                subLabel={helpText(
                                    'objects.initiativeActivity.Publication_Author__c'
                                )}
                                placeholder={label(
                                    'custom.FA_FormCaptureTextEntryEmpty'
                                )}
                                maxLength={80}
                                controller={control}
                            />
                            <Text
                                name="Publication_DOI__c"
                                label={label(
                                    'objects.initiativeActivity.Publication_DOI__c'
                                )}
                                subLabel={helpText(
                                    'objects.initiativeActivity.Publication_DOI__c'
                                )}
                                placeholder={label(
                                    'custom.FA_FormCaptureTextEntryEmpty'
                                )}
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
