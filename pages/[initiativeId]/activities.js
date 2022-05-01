// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useLabels, useAuth } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';
import { isJson, stripUndefined } from 'utilities';

// Components
import Preloader from 'components/preloader';
import Footer from 'components/_layout/footer';
import UpdateButton from 'components/updateButton';
import SectionWrapper from 'components/sectionWrapper';
import SectionEmpty from 'components/sectionEmpty';
import ReportDetailCard from 'components/_initiative/reportDetailCard';
// import ChartCard from 'components/_initiative/chartCard';

const ActivitiesComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Fetch initiative data
    const { initiative, utilities, CONSTANTS } = useInitiativeDataStore();

    // Hook: Metadata
    const { label, getValueLabel, log } = useLabels();

    const [activities, setActivities] = useState();

    log();

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
            const activities = Object.values(initiative._activities)
                .filter(item => {
                    return item.Activity_Type__c ===
                        CONSTANTS.TYPES.ACTIVITY_INTERVENTION
                        ? true
                        : false;
                })
                .map((item, index) => {
                    const title = item.Things_To_Do__c;
                    const location = item.Initiative_Location__c?.split(
                        ';'
                    ).join(', ');
                    const successIndicators = utilities.activitySuccessMetrics
                        .getFromActivityId(item.Id)
                        .map(success => {
                            return success.Name;
                        });

                    // Check if they have related goals
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
                                        relatedGoal.Initiative_Goal__c ==
                                            goal.Id &&
                                        goal.Type__c ==
                                            CONSTANTS.TYPES.GOAL_PREDEFINED
                                    ) {
                                        return {
                                            description:
                                                goal.Funder_Objective__c,
                                        };
                                    } else if (
                                        relatedGoal.Initiative_Goal__c ==
                                            goal.Id &&
                                        goal.Type__c ==
                                            CONSTANTS.TYPES.GOAL_CUSTOM
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
                        successIndicators,
                        goals: descriptions,
                        relatedGoals: stripUndefined(relatedGoals),
                        activityType: item.Activity_Tag__c?.split(';').map(a =>
                            getValueLabel(
                                'initiativeActivity.Activity_Tag__c',
                                a,
                                true
                            )
                        ),
                    };
                });
            setActivities(activities);
        } else if (
            initiative?.Id &&
            Object.keys(initiative?._activities).length < 1
        ) {
            setActivities([]);
        }
    }, [initiative]);

    return (
        <>
            {/* Preloading - Show loading */}
            {!initiative?.Id && <Preloader hasBg={true} />}

            {/* Data Loaded - Show initiative */}
            {initiative?.Id && (
                <div className="animate-fade-in">
                    <SectionWrapper>
                        <div className="t-h1">{label('MenuActivities')}</div>
                    </SectionWrapper>
                    <SectionWrapper className="bg-white mb-128 rounded-8">
                        <div className="flex justify-between">
                            <h2 className="t-h3">
                                {label('InitiativeViewActivitiesHeading')}
                            </h2>
                            <UpdateButton
                                mode="initiative"
                                baseUrl="activities"
                            />
                        </div>

                        {activities?.length > 0 &&
                            activities?.map((item, index) => (
                                <div key={`a-${index}`} className="mt-64">
                                    <h3 className="t-h4">{item.title}</h3>
                                    <ReportDetailCard
                                        description={item.description}
                                        items={[
                                            {
                                                label: label(
                                                    'InitiativeViewActivityLocation'
                                                ),
                                                text: getValueLabel(
                                                    'initiativeActivity.Initiative_Location__c',
                                                    item.location
                                                ),
                                            },
                                        ]}
                                    />
                                    {item.activityType?.length > 0 && (
                                        <>
                                            <div className="mt-32 t-h6">
                                                {label(
                                                    'InitiativeViewActivityType'
                                                )}
                                            </div>
                                            <div className="flex flex-col items-start">
                                                {item.activityType?.map(
                                                    (type, index) => (
                                                        <div
                                                            key={`t-${index}`}
                                                            className="px-10 pt-6 pb-3 mt-16 bg-blue-20 rounded-4 t-sh7">
                                                            {type}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </>
                                    )}
                                    {item.successIndicators?.length > 0 && (
                                        <>
                                            <div className="mt-32 t-h5">
                                                {label(
                                                    'InitiativeViewActivityIndicators'
                                                )}
                                            </div>

                                            {item.successIndicators?.map(
                                                (success, index) => (
                                                    <div
                                                        key={`s-${index}`}
                                                        className="p-12 mt-16 bg-blue-10 rounded-4 t-sh5">
                                                        {success}
                                                    </div>
                                                )
                                            )}
                                        </>
                                    )}

                                    {/* Related goals */}
                                    {item.relatedGoals.length > 0 && (
                                        <>
                                            <div className="mt-32 t-h5">
                                                {label(
                                                    'InitiativeViewActivityRelatedGoals'
                                                )}
                                            </div>
                                            {item.relatedGoals.map(
                                                (goal, index) => (
                                                    <div
                                                        key={`g-${index}`}
                                                        className="p-12 mt-16 border-4 border-blue-10 rounded-4 t-sh5">
                                                        {goal[0].description}
                                                    </div>
                                                )
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}

                        {/* Empty state - No Activities */}
                        {activities?.length < 1 && (
                            <SectionEmpty type="initiative" />
                        )}
                    </SectionWrapper>
                    <Footer />
                </div>
            )}
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
