// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useMetadata, useAuth } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';
import { isJson, stripUndefined } from 'utilities';

// Components
import Button from 'components/button';
import SectionWrapper from 'components/sectionWrapper';
import ReportDetailCard from 'components/_initiative/reportDetailCard';
// import ChartCard from 'components/_initiative/chartCard';

const ActivitiesComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Fetch initiative data
    const { initiative, CONSTANTS } = useInitiativeDataStore();

    // Hook: Metadata
    const { labelTodo, label, valueSet, log } = useMetadata();

    const [activities, setActivities] = useState();

    useEffect(() => {
        // Make sure data it loaded
        if (
            initiative?._activities &&
            Object.keys(initiative?._activities).length !== 0
        ) {
            const descriptions = isJson(initiative.Problem_Resolutions__c)
                ? JSON.parse(initiative.Problem_Resolutions__c)
                : initiative.Problem_Resolutions__c;

            // Only show activities with type "Intervention"
            let activities = Object.values(initiative._activities).filter(
                item => {
                    console.log(item);
                    return item.Activity_Type__c ===
                        CONSTANTS.TYPES.ACTIVITY_INTERVENTION
                        ? true
                        : false;
                }
            );
            // Check if they have related goals
            activities = activities.map((item, index) => {
                const title = item.Things_To_Do__c;
                const location = item.Initiative_Location__c
                    ? item.Initiative_Location__c.split(';').join(', ')
                    : labelTodo('Location not available');
                const successIndicators = item.Initiative_Activity_Success_Metrics__r?.records.map(
                    success => {
                        return success.Name;
                    }
                );
                const relatedGoals = Object.values(
                    initiative._activityGoals
                ).map(relatedGoal => {
                    // This activity has a RelatedGoal
                    if (relatedGoal.Initiative_Activity__c == item.Id) {
                        // Compare RelatedGoals ID -> with Goal Ids
                        return Object.values(initiative._goals).map(
                            (goal, index) => {
                                // Return the original Goal description
                                if (
                                    relatedGoal.Initiative_Goal__c == goal.Id &&
                                    goal.Type__c ==
                                        CONSTANTS.TYPES.GOAL_PREDEFINED
                                ) {
                                    return {
                                        description: goal.Funder_Objective__c,
                                    };
                                } else if (
                                    relatedGoal.Initiative_Goal__c == goal.Id &&
                                    goal.Type__c == CONSTANTS.TYPES.GOAL_CUSTOM
                                ) {
                                    return { description: goal.Goal__c };
                                }
                            }
                        );
                    }
                });

                return {
                    // type: item.Activity_Type__c, // "Intervention" or "Dissemination"
                    title: title,
                    description: item.Things_To_Do_Description__c,
                    location: location,
                    successIndicators: successIndicators,
                    goals: descriptions,
                    relatedGoals: stripUndefined(relatedGoals),
                };
            });
            console.log('activities: ', activities);
            setActivities(activities);
        }
    }, [initiative]);

    return (
        <>
            <SectionWrapper>
                <div className="t-h1">Activities</div>
            </SectionWrapper>

            <SectionWrapper className="bg-white mb-128 rounded-8">
                <div className="flex justify-between">
                    <h2 className="t-h3">{labelTodo('Activities')}</h2>
                    <Button variant="secondary">{labelTodo('Update')}</Button>
                </div>

                {activities?.length > 0 &&
                    activities.map((item, index) => (
                        <div key={`a-${index}`} className="mt-64">
                            <h3 className="t-h4">{item.title}</h3>
                            <ReportDetailCard
                                description={item.description}
                                items={[
                                    {
                                        label: 'Location',
                                        text: item.location,
                                    },
                                ]}
                            />

                            {item.successIndicators && (
                                <>
                                    <div className="mt-16 t-h5">
                                        Success indicators
                                    </div>

                                    {item.successIndicators.map(
                                        (success, index) => (
                                            <div
                                                key={`s-${index}`}
                                                className="p-8 mt-16 bg-blue-10 rounded-4 t-sh5">
                                                {success}
                                            </div>
                                        )
                                    )}
                                </>
                            )}

                            <SectionWrapper>
                                <div className="t-h5">Related goals</div>
                                {item.relatedGoals.map((goal, index) => (
                                    <div
                                        key={`g-${index}`}
                                        className="p-8 mt-16 border-4 border-blue-10 rounded-4 t-sh5">
                                        {goal[0].description}
                                    </div>
                                ))}
                            </SectionWrapper>
                        </div>
                    ))}
            </SectionWrapper>

            {/* Indicators */}
            {/* <div className="mt-32 bg-white rounded-8">
                <SectionWrapper>
                    <div className="flex justify-between">
                        <h2 className="t-h3">{labelTodo('Indicators')}</h2>
                        <Button variant="secondary">
                            {labelTodo('Update')}
                        </Button>
                    </div>
                </SectionWrapper>

                <ChartCard
                    items={[
                        { title: 'Schools built' },
                        { title: 'Wells built' },
                    ]}
                />
            </div> */}
        </>
    );
};

// export async function getStaticProps(context) {
//     return {
//         props: {}, // will be passed to the page component as props
//     };
// }

ActivitiesComponent.propTypes = {
    pageProps: t.object,
};

ActivitiesComponent.defaultProps = {
    pageProps: {},
};

ActivitiesComponent.layout = 'initiative';

export default ActivitiesComponent;
