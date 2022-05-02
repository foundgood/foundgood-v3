// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState, useWatch } from 'react-hook-form';
import _get from 'lodash.get';
import dayjs from 'dayjs';

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
import TitlePreamble from 'components/_wizard/titlePreamble';
import Button from 'components/button';
import Modal from 'components/modal';
import { InputWrapper, Select, SelectList, Text } from 'components/_inputs';
import ResultCard from 'components/_wizard/resultCard';
import NoReflections from 'components/_wizard/noReflections';

const SharingResultsComponent = ({ pageProps }) => {
    // ///////////////////
    // ///////////////////
    // AUTH
    // ///////////////////

    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // ///////////////////
    // ///////////////////
    // STORES
    // ///////////////////

    const { initiative, utilities, CONSTANTS } = useInitiativeDataStore();
    const { setCurrentSubmitHandler, currentItem } = useWizardNavigationStore();
    const { getValueLabel, valueSet, label, object } = useLabels();

    // ///////////////////
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { MODE, CONTEXTS, REPORT_ID } = useContext();
    const { ewCreateUpdateWrapper } = useElseware();
    const {
        submitMultipleNoReflections,
        submitMultipleReflections,
    } = useReflections({
        dataSet: utilities.activities.getTypeDissemination,
        parentKey: 'Initiative_Activity__c',
        type: CONSTANTS.REPORT_DETAILS.ACTIVITY_OVERVIEW,
    });

    // ///////////////////
    // ///////////////////
    // STATE
    // ///////////////////

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsSaving, setModalIsSaving] = useState(false);
    const [reflecting, setReflecting] = useState(false);
    const [updateId, setUpdateId] = useState(null);
    const [disseminationType, setDisseminationType] = useState(null);

    // ///////////////////
    // ///////////////////
    // FORMS
    // ///////////////////

    const { handleSubmit, control, setValue, reset } = useForm();
    const {
        handleSubmit: handleSubmitReflections,
        control: controlReflections,
        setValue: setValueReflections,
    } = useForm();
    const { isDirty } = useFormState({ control });
    const disseminationTypeSelect = useWatch({
        control,
        name: 'Dissemination_Method__c',
    });

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
                { Initiative__c: initiative.Id },
                '_activities'
            );

            // Close modal
            setModalIsOpen(false);

            // Modal save button state
            setModalIsSaving(false);

            // Clear content in form
            reset();

            // Fold out shit when done if report
            // setValue: setValueReflections,
            setTimeout(() => {
                if (MODE === CONTEXTS.REPORT) {
                    setValueReflections(`${activityData.Id}-selector`, true);
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
        setTimeout(() => {
            setCurrentSubmitHandler(
                MODE === CONTEXTS.REPORT
                    ? handleSubmitReflections(submitMultipleReflections, error)
                    : null
            );
        }, 100);
    }, [initiative]);

    // ///////////////////
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

    return (
        <>
            <TitlePreamble
                title={label(currentItem?.item?.labels?.form?.title)}
                preamble={label(currentItem?.item?.labels?.form?.preamble)}
                preload={!initiative.Id}
            />
            <InputWrapper preload={!initiative.Id}>
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
                            'initiativeActivity.Dissemination_Method__c',
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
                                      'initiativeActivity.Audience_Tag__c',
                                      tag
                                  )
                              )
                        : [];

                    const reflection = currentReportDetails.filter(
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
                                MODE === CONTEXTS.REPORT && controlReflections
                            }
                            name={activity.Id}
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
                <Button
                    theme="teal"
                    className="self-start"
                    action={() => {
                        setUpdateId(null);
                        setModalIsOpen(true);
                    }}>
                    {label('ButtonAddResult')}
                </Button>
            </InputWrapper>
            <Modal
                isOpen={modalIsOpen}
                title={label('WizardModalHeadingSharing')}
                onCancel={() => setModalIsOpen(false)}
                disabledSave={!isDirty || modalIsSaving}
                onSave={handleSubmit(submit)}>
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
                        controller={control}
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
                        options={valueSet(
                            'initiativeActivity.Dissemination_Method__c'
                        )}
                        controller={control}
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
                        options={valueSet('initiativeActivity.Audience_Tag__c')}
                        listMaxLength={4}
                        controller={control}
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
                                controller={control}
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
                                controller={control}
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
                                controller={control}
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
                                controller={control}
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
                                controller={control}
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
