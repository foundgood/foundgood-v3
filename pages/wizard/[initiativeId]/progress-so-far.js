// React
import React, { useEffect } from 'react';

// Packages
import { useForm } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import { useAuth, useMetadata, useSalesForce } from 'utilities/hooks';
import {
    useWizardNavigationStore,
    useInitiativeDataStore,
} from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import { InputWrapper } from 'components/_inputs';
import ProgressCard from 'components/_wizard/progressCard';

const ProgressSoFarComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo, label } = useMetadata();

    // Hook: useForm setup
    const { handleSubmit, control } = useForm();

    // Hook: Salesforce setup
    const { sfUpdate } = useSalesForce();

    // Store: Wizard navigation
    const { setCurrentSubmitHandler, currentItem } = useWizardNavigationStore();

    // Store: Initiative data
    const {
        initiative,
        updateActivitySuccessMetrics,
        CONSTANTS,
    } = useInitiativeDataStore();

    // Method: Adds founder to sf and updates founder list in view
    async function submit(formData) {
        try {
            // Object name
            const object = 'Initiative_Activity_Success_Metric__c';

            await Promise.all(
                Object.keys(formData)
                    .filter(key => formData[key])
                    .map(key => {
                        sfUpdate({
                            object,
                            data: {
                                Current_Status__c:
                                    (initiative?._activitySuccessMetrics[key]
                                        ?.Current_Status__c ?? 0) +
                                    parseInt(formData[key], 10),
                            },
                            id: key,
                        });
                    })
            );

            setTimeout(async () => {
                // Update store
                await updateActivitySuccessMetrics(
                    Object.keys(formData).filter(key => formData[key])
                );
            }, 200);
        } catch (error) {
            console.warn(error);
        }
    }

    // Method: Form error/validation handler
    function error(error) {
        console.warn('Form invalid', error);
        throw error;
    }

    // Add submit handler to wizard navigation store
    useEffect(() => {
        setTimeout(() => {
            setCurrentSubmitHandler(handleSubmit(submit, error));
        }, 10);
    }, []);

    // Activities
    const activities = Object.keys(initiative?._activities);

    return (
        <>
            <TitlePreamble
                title={label(currentItem?.item?.labels?.form?.title)}
                preamble={label(currentItem?.item?.labels?.form?.preamble)}
            />
            <InputWrapper>
                {activities.length > 0 ? (
                    activities.map(activityKey => {
                        const activity = initiative?._activities[activityKey];
                        // Get success metric items based on activity id (activityKey) and activitySuccessMetric.XXX
                        const successMetricItems = Object.values(
                            initiative?._activitySuccessMetrics
                        ).filter(
                            item => item.Initiative_Activity__c === activityKey
                        );

                        return (
                            <ProgressCard
                                key={activity.Id}
                                headline={
                                    _get(activity, 'Things_To_Do__c') || ''
                                }
                                controller={control}
                                items={successMetricItems.map(item => ({
                                    id: item.Id,
                                    headline:
                                        item.Type__c ===
                                        CONSTANTS.TYPES.INDICATOR_CUSTOM
                                            ? item.Name
                                            : `${item.Gender__c} ${
                                                  item.Gender_Other__c
                                                      ? `(${item.Gender_Other__c})`
                                                      : ''
                                              } ${item.KPI__c} ${
                                                  item.Lowest_Age__c
                                              }-${item.Highest_Age__c}`,
                                    label: item.Type__c,
                                    currently: item.Current_Status__c,
                                }))}
                            />
                        );
                    })
                ) : (
                    <p className="t-h5">
                        {label('custom.FA_WizardEmptyStatesProgress')}
                    </p>
                )}
            </InputWrapper>
        </>
    );
};

ProgressSoFarComponent.propTypes = {};

ProgressSoFarComponent.defaultProps = {};

ProgressSoFarComponent.layout = 'wizard';

export default ProgressSoFarComponent;
