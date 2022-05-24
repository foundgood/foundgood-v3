// React
import React from 'react';

// Packages
import { useForm } from 'react-hook-form';
import _get from 'lodash.get';

// Utilities
import {
    useContext,
    useElseware,
    useLabels,
    useWizardSubmit,
} from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import WithPermission from 'components/withPermission';
import TitlePreamble from 'components/_wizard/titlePreamble';
import { InputWrapper } from 'components/_inputs';
import ProgressCard from 'components/_wizard/progressCard';

const ProgressSoFarComponent = ({ pageProps }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { CONTEXTS } = useContext();
    const { label } = useLabels();
    const { ewUpdate } = useElseware();

    // ///////////////////
    // FORMS
    // ///////////////////

    // Hook: useForm setup
    const mainForm = useForm();

    // ///////////////////
    // SUBMIT
    // ///////////////////

    useWizardSubmit({
        [CONTEXTS.INITIATIVE]: [
            mainForm,
            async formData => {
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
                                        Current_Status__c: parseInt(
                                            formData[key],
                                            10
                                        ),
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
            },
        ],
    });

    // ///////////////////
    // DATA
    // ///////////////////

    // Activities
    const activities = utilities.activities.getTypeIntervention();

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <>
            <TitlePreamble />
            <InputWrapper>
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
                                controller={mainForm.control}
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

ProgressSoFarComponent.permissions = 'context';

export default WithAuth(WithPermission(ProgressSoFarComponent));
