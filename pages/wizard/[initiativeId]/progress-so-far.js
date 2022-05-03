// React
import React, { useEffect } from 'react';

// Packages
import { useForm } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import { useAuth, useElseware, useLabels } from 'utilities/hooks';
import {
    useWizardNavigationStore,
    useInitiativeDataStore,
} from 'utilities/store';

// Components
import TitlePreamble from 'components/_wizard/titlePreamble';
import { InputWrapper } from 'components/_inputs';
import ProgressCard from 'components/_wizard/progressCard';

const ProgressSoFarComponent = ({ pageProps }) => {
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

    const { setCurrentSubmitHandler, currentItem } = useWizardNavigationStore();
    const { initiative, utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label } = useLabels();
    const { ewUpdate } = useElseware();

    // ///////////////////
    // ///////////////////
    // FORMS
    // ///////////////////

    // Hook: useForm setup
    const { handleSubmit, control } = useForm();

    // ///////////////////
    // ///////////////////
    // METHODS
    // ///////////////////

    // Method: Adds founder to sf and updates founder list in view
    async function submit(formData) {
        try {
            await Promise.all(
                Object.keys(formData)
                    .filter(key => formData[key])
                    .map(async key => {
                        const { data } = await ewUpdate(
                            'initiative-activity-success-metric/initiative-activity-success-metric',
                            key,
                            {
                                // Previous behaviour was to add numbers
                                // Current_Status__c:
                                //     (initiative?._activitySuccessMetrics[key]
                                //         ?.Current_Status__c ?? 0) +
                                //     parseInt(formData[key], 10),
                                // Current status is just to show
                                Current_Status__c: parseInt(formData[key], 10),
                            }
                        );

                        utilities.updateInitiativeData(
                            '_activitySuccessMetrics',
                            data
                        );
                    })
            );
        } catch (error) {
            console.warn(error);
        }
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

    // Add submit handler to wizard navigation store
    useEffect(() => {
        setTimeout(() => {
            setCurrentSubmitHandler(handleSubmit(submit, error));
        }, 100);
    }, [initiative]);

    // ///////////////////
    // ///////////////////
    // DATA
    // ///////////////////

    // Activities
    const activities = utilities.activities.getTypeIntervention();

    return (
        <>
            <TitlePreamble
                title={label(currentItem?.item?.labels?.form?.title)}
                preamble={label(currentItem?.item?.labels?.form?.preamble)}
                preload={!initiative.Id}
            />
            <InputWrapper preload={!initiative.Id}>
                {activities.length > 0 ? (
                    activities.map(activity => {
                        // Get success metric items based on activity id (activity.Id) and activitySuccessMetric.XXX
                        const successMetricItems = utilities.activitySuccessMetrics.getFromActivityId(
                            activity.Id
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
                                        CONSTANTS.ACTIVITY_SUCCESS_METRICS
                                            .INDICATOR_CUSTOM
                                            ? item.Name
                                            : `${item.Gender__c} ${
                                                  item.Gender_Other__c
                                                      ? `(${item.Gender_Other__c})`
                                                      : ''
                                              } ${item.KPI__c}`,
                                    label: item.Type__c,
                                    currently: item.Current_Status__c,
                                }))}
                            />
                        );
                    })
                ) : (
                    <p className="t-h5">{label('WizardEmptyStatesProgress')}</p>
                )}
            </InputWrapper>
        </>
    );
};

ProgressSoFarComponent.propTypes = {};

ProgressSoFarComponent.defaultProps = {};

ProgressSoFarComponent.layout = 'wizard';

export default ProgressSoFarComponent;
