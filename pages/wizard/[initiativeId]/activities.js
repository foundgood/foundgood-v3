// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm, useFormState } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import {
    useAuth,
    useContext,
    useElseware,
    useLabels,
    useReflections,
    useWizardSubmit,
} from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import Button from 'components/button';
import WizardModal from 'components/wizardModal';
import { InputWrapper, SelectList, Text, LongText } from 'components/_inputs';
import ActivityCard from 'components/_wizard/activityCard';
import NoReflections from 'components/_wizard/noReflections';

const ActivitiesComponent = ({ pageProps }) => {
    // ///////////////////
    // AUTH
    // ///////////////////

    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { MODE, CONTEXTS, REPORT_ID } = useContext();
    const { label, object, pickList, controlledPickList } = useLabels();
    const { ewUpdate, ewCreate } = useElseware();
    const {
        submitNoReflection,
        submitMultipleReflections,
        getReflectionDefaultValue,
    } = useReflections({
        dataSet() {
            return utilities.activities.getAll;
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

    // ///////////////////
    // FORMS
    // ///////////////////

    const mainForm = useForm();
    const reflectionForm = useForm();
    const { isDirty } = useFormState({ control: mainForm.control });

    // ///////////////////
    // SUBMIT
    // ///////////////////

    async function submit(formData) {
        // Modal save button state
        setModalIsSaving(true);
        try {
            const {
                Things_To_Do__c,
                Things_To_Do_Description__c,
                Activities,
                Location,
                Goals,
            } = formData;

            // Data for sf
            const data = {
                Activity_Type__c: CONSTANTS.ACTIVITIES.ACTIVITY_INTERVENTION,
                Things_To_Do__c,
                Things_To_Do_Description__c,
                Initiative_Location__c: Location[0]?.selectValue,
                Additional_Location_Information__c: Location[0]?.textValue,
                Activity_Tag__c: Activities.map(item => item.selectValue).join(
                    ';'
                ),
                KPI_Category__c: utilities.initiative.get().Category__c,
                _activityGoals: Goals.map(item => item.selectValue),
            };

            // Update / save (custom)
            const { data: activityData } = updateId
                ? await ewUpdate(
                      'initiative-activity/initiative-activity-intervention',
                      updateId,
                      data
                  )
                : await ewCreate(
                      'initiative-activity/initiative-activity-intervention',
                      {
                          ...data,
                          Initiative__c: utilities.initiative.get().Id,
                      }
                  );

            // Destructure response
            const { _activityGoals, ...rest } = activityData;

            // Clean out existing related data
            utilities.removeInitiativeDataRelations(
                '_activityGoals',
                item => item.Initiative_Activity__c === updateId
            );

            // Update main data
            utilities.updateInitiativeData('_activities', rest);

            // Updated related data
            utilities.updateInitiativeDataRelations(
                '_activityGoals',
                _activityGoals
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
    // DATA
    // ///////////////////

    // Current report details
    const currentReportDetails = utilities.reportDetails.getFromReportId(
        REPORT_ID
    );

    // Custom goals
    const customGoals = utilities.goals.getTypeCustom();

    // Check if there is relevant report details yet
    const reportDetailsItems = currentReportDetails.filter(item =>
        utilities.activities
            .getTypeIntervention()
            .map(item => item.Id)
            .includes(item.Initiative_Activity__c)
    );

    // Get activities
    const activities = utilities.activities.getTypeIntervention();

    // ///////////////////
    // EFFECTS
    // ///////////////////

    // Effect: Set value based on modal elements based on updateId
    useEffect(() => {
        const {
            Id,
            Things_To_Do__c,
            Things_To_Do_Description__c,
            Activity_Tag__c,
            Initiative_Location__c,
            Additional_Location_Information__c,
        } = utilities.activities.get(updateId);

        mainForm.setValue(
            'Things_To_Do_Description__c',
            Things_To_Do_Description__c
        );
        mainForm.setValue('Things_To_Do__c', Things_To_Do__c);
        mainForm.setValue('Location', [
            {
                selectValue: Initiative_Location__c,
                textValue: Additional_Location_Information__c,
            },
        ]);

        mainForm.setValue(
            'Activities',
            Activity_Tag__c?.split(';').map(value => ({
                selectValue: value,
            }))
        );

        mainForm.setValue(
            'Goals',
            utilities.activityGoals.getFromActivityId(Id).map(activityGoal => ({
                selectValue: activityGoal.Initiative_Goal__c,
            }))
        );
    }, [updateId, modalIsOpen]);

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <>
            <TitlePreamble />
            <InputWrapper>
                <Button
                    theme="teal"
                    className="self-start"
                    action={() => {
                        setUpdateId(null);
                        setModalIsOpen(true);
                    }}>
                    {label('ButtonAddActivity')}
                </Button>
                {MODE === CONTEXTS.REPORT && activities.length > 0 && (
                    <NoReflections
                        onClick={submitNoReflection}
                        reflectionItems={reportDetailsItems.map(
                            item => item.Description__c
                        )}
                        reflecting={reflecting}
                    />
                )}
                {activities.map(activity => {
                    const headline = _get(activity, 'Things_To_Do__c') || '';
                    const description =
                        _get(activity, 'Things_To_Do_Description__c') || '';

                    const tagsString = activity?.Activity_Tag__c ?? null;
                    const tags = tagsString ? tagsString.split(';') : [];
                    const goals = utilities.activityGoals
                        .getFromActivityId()
                        .map(
                            activityGoal =>
                                activityGoal?.Initiative_Goal__r?.Goal__c
                        );
                    const reflection = currentReportDetails.find(
                        item => item.Initiative_Activity__c === activity.Id
                    );

                    return (
                        <ActivityCard
                            key={activity.Id}
                            headline={headline}
                            description={description}
                            tags={tags}
                            goals={goals}
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
                            inputLabel={label(
                                'ReportWizardActivitiesReflectionSubHeading'
                            )}
                        />
                    );
                })}
            </InputWrapper>
            <WizardModal
                isOpen={modalIsOpen}
                title={label('WizardModalHeadingActivities')}
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
                    <LongText
                        name="Things_To_Do_Description__c"
                        label={object.label(
                            'Initiative_Activity__c.Things_To_Do_Description__c'
                        )}
                        subLabel={object.helpText(
                            'Initiative_Activity__c.Things_To_Do_Description__c'
                        )}
                        placeholder={label('FormCaptureTextEntryEmpty')}
                        maxLength={400}
                        controller={mainForm.control}
                    />
                    <SelectList
                        name="Activities"
                        label={object.label(
                            'Initiative_Activity__c.Activity_Tag__c'
                        )}
                        subLabel={object.helpText(
                            'Initiative_Activity__c.Activity_Tag__c'
                        )}
                        selectPlaceholder={label('FormCaptureSelectEmpty')}
                        options={controlledPickList(
                            'Initiative_Activity__c.Activity_Tag__c',
                            utilities.initiative.get().Category__c
                        )}
                        buttonLabel={label('ButtonAddActivityTag')}
                        listMaxLength={utilities.isNovoLeadFunder() ? 1 : 4}
                        controller={mainForm.control}
                        required={utilities.isNovoLeadFunder()}
                    />
                    <SelectList
                        name="Location"
                        label={object.label(
                            'Initiative_Activity__c.Initiative_Location__c'
                        )}
                        subLabel={object.helpText(
                            'Initiative_Activity__c.Initiative_Location__c'
                        )}
                        listMaxLength={1}
                        options={pickList(
                            'Initiative_Activity__c.Initiative_Location__c'
                        )}
                        showText
                        selectPlaceholder={label('FormCaptureSelectEmpty')}
                        selectLabel={label('FormCaptureCountry')}
                        textLabel={label('FormCaptureRegion')}
                        controller={mainForm.control}
                    />
                    {customGoals.length > 0 && (
                        <SelectList
                            name="Goals"
                            label={object.label('Initiative_Goal__c.Goal__c')}
                            subLabel={object.helpText(
                                'Initiative_Goal__c.Goal__c'
                            )}
                            options={customGoals.map(goal => ({
                                value: goal.Id,
                                label: goal.Goal__c,
                            }))}
                            selectPlaceholder={label('FormCaptureSelectEmpty')}
                            controller={mainForm.control}
                            buttonLabel={label('ButtonAddGoal')}
                        />
                    )}
                </InputWrapper>
            </WizardModal>
        </>
    );
};

ActivitiesComponent.propTypes = {};

ActivitiesComponent.defaultProps = {};

ActivitiesComponent.layout = 'wizard';

export default ActivitiesComponent;
