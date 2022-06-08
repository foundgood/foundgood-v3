// React
import React, { useEffect, useState } from 'react';

// Packages
import { useForm } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import {
    useElseware,
    useLabels,
    useModalState,
    useWizardSubmit,
} from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import WithPermission from 'components/withPermission';
import TitlePreamble from 'components/_wizard/titlePreamble';
import EmptyState from 'components/_wizard/emptyState';
import ReportUpdatesInPage from 'components/_wizard/reportUpdatesInPage';
import Button from 'components/button';
import WizardModal from 'components/_modals/wizardModal';
import { InputWrapper, SelectList, Text, LongText } from 'components/_inputs';
import { BaseCard, ReportUpdate, ActivityCardContent } from 'components/_cards';

const ActivitiesComponent = ({ pageProps }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label, object, dataSet } = useLabels();
    const { ewUpdate, ewCreate } = useElseware();
    const {
        modalState,
        modalOpen,
        modalClose,
        modalSaving,
        modalNotSaving,
    } = useModalState();

    // ///////////////////
    // STATE
    // ///////////////////

    const [updateId, setUpdateId] = useState(null);

    // ///////////////////
    // FORMS
    // ///////////////////

    const mainForm = useForm();

    // ///////////////////
    // SUBMIT
    // ///////////////////

    async function submit(formData) {
        // Modal save button state
        modalSaving();
        try {
            const {
                Things_To_Do__c,
                Things_To_Do_Description__c,
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
            modalClose();

            // Modal save button state
            modalNotSaving();

            // Clear content in form
            mainForm.reset();
        } catch (error) {
            // Modal save button state
            modalNotSaving();
            console.warn(error);
        }
    }

    useWizardSubmit();

    // ///////////////////
    // DATA
    // ///////////////////

    // Custom goals
    const customGoals = utilities.goals.getTypeCustom();

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
            'Goals',
            utilities.activityGoals.getFromActivityId(Id).map(activityGoal => ({
                selectValue: activityGoal.Initiative_Goal__c,
            }))
        );
    }, [updateId, modalState]);

    // ///////////////////
    // RENDER
    // ///////////////////

    const UpdateButton = () => (
        <Button
            theme="teal"
            className="self-start"
            action={() => {
                setUpdateId(null);
                modalOpen();
            }}>
            {label('ButtonAddActivity')}
        </Button>
    );

    return (
        <WithPermission context>
            <TitlePreamble />
            <InputWrapper>
                <ReportUpdatesInPage
                    {...{
                        items: activities,
                        itemRelationKey: 'Initiative_Activity__c',
                    }}
                />
                {activities.length > 0 ? (
                    <>
                        <UpdateButton />
                        {activities.map(item => (
                            <BaseCard
                                key={item.Id}
                                {...{
                                    title: item?.Things_To_Do__c,
                                    type: label('CardActivityType'),
                                    methods: {
                                        edit: {
                                            action: () => {
                                                setUpdateId(item.Id);
                                                modalOpen();
                                            },
                                        },
                                    },
                                    components: {
                                        cardContent: (
                                            <ActivityCardContent
                                                {...{ item }}
                                            />
                                        ),
                                        reportUpdate: (
                                            <ReportUpdate
                                                {...{
                                                    item,
                                                    itemRelationKey:
                                                        'Initiative_Activity__c',
                                                    reflectionType:
                                                        CONSTANTS.REPORT_DETAILS
                                                            .ACTIVITY_OVERVIEW,
                                                    title: label(
                                                        'ReportUpdateModalActivityHeading'
                                                    ),
                                                }}
                                            />
                                        ),
                                    },
                                }}
                            />
                        ))}
                    </>
                ) : (
                    <EmptyState
                        {...{
                            text: label('InitiativeWizardActivitiesEmptyState'),
                        }}>
                        <UpdateButton />
                    </EmptyState>
                )}
            </InputWrapper>
            <WizardModal
                {...{
                    form: mainForm,
                    onCancel() {
                        modalClose();
                    },
                    onSave() {
                        mainForm.handleSubmit(submit)();
                    },
                    title: label('WizardModalHeadingActivities'),
                    ...modalState,
                }}>
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
                        name="Location"
                        label={object.label(
                            'Initiative_Activity__c.Initiative_Location__c'
                        )}
                        subLabel={object.helpText(
                            'Initiative_Activity__c.Initiative_Location__c'
                        )}
                        listMaxLength={1}
                        options={dataSet('Countries')}
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
        </WithPermission>
    );
};

ActivitiesComponent.propTypes = {};

ActivitiesComponent.defaultProps = {};

ActivitiesComponent.layout = 'wizard';

export default WithAuth(ActivitiesComponent);
