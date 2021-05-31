// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useMetadata } from 'utilities/hooks';
import { asId, stripUndefined } from 'utilities';

// Components
import SectionWrapper from 'components/sectionWrapper';
import SectionEmpty from 'components/sectionEmpty';
import UpdateButton from 'components/updateButton';
import ReportDetailCard from 'components/_initiative/reportDetailCard';
import ChartCard from 'components/_initiative/chartCard';
import TextCard from 'components/_initiative/textCard';
import DividerLine from 'components/_initiative/dividerLine';

const ReportActivitiesComponent = ({ initiative, report, constants }) => {
    // Hook: Metadata
    const { labelTodo, label } = useMetadata();

    const [activities, setActivities] = useState([]);

    useEffect(() => {
        // Make sure we have Report Details
        if (Object.values(initiative._reportDetails).length > 0) {
            // Get reports ALL Activities
            // Activies are split between:
            // Activities == "Intervention"
            // Sharing of results == "Dissimination"
            const allActivities = Object.values(initiative._reportDetails)
                .filter(item => {
                    return item.Type__c == constants.TYPES.ACTIVITY_OVERVIEW
                        ? true
                        : false;
                })
                .map(item => {
                    // Get Activity based on key
                    const activity =
                        initiative._activities[item.Initiative_Activity__c];
                    // Add Report Reflection text to activities
                    activity.reportReflection = item.Description__c;
                    return activity;
                });

            // Create list of indicators per "Activity"
            // Type == "Intervention"
            const activities = Object.values(allActivities).reduce(
                (accumulator, activity) => {
                    const title = activity.Things_To_Do__c;
                    const description = activity.Things_To_Do_Description__c;
                    const location = activity.Initiative_Location__c.split(
                        ';'
                    ).join(', ');
                    const reportReflection = activity.reportReflection;

                    // Loop indicators
                    // Add indicators if it matches the activity ID
                    const indicators = Object.values(
                        initiative._activitySuccessMetrics
                    ).map(item => {
                        if (activity.Id == item.Initiative_Activity__c) {
                            // let title;
                            // let label;
                            // let groupTitle;
                            // Not all indicators have a "Target"
                            const value = item.Target__c
                                ? `${item.Current_Status__c} / ${item.Target__c}`
                                : item.Current_Status__c;

                            if (
                                item.Type__c ===
                                constants.TYPES.INDICATOR_PREDEFINED
                            ) {
                                // If gender is "Other" -> use "Gender_Other__c" field
                                const gender =
                                    item.Gender__c ==
                                    constants.TYPES.INDICATOR_GENDER_OTHER
                                        ? item.Gender_Other__c
                                        : item.Gender__c;

                                return {
                                    type: item.Type__c,
                                    groupTitle: label(
                                        'custom.FA_InitiativeViewIndicatorsPeopleReached'
                                    ),
                                    title: `${gender} (${labelTodo('age')} ${
                                        item.Lowest_Age__c
                                    }-${item.Highest_Age__c})`,
                                    value: value,
                                    label: label(
                                        'custom.FA_ReportViewActivitiesGraphKeyDuring'
                                    ),
                                };
                            }
                            // Custom indicators - constants.TYPES.INDICATOR_CUSTOM
                            else {
                                return {
                                    type: item.Type__c,
                                    groupTitle: label(
                                        'custom.FA_InitiativeViewIndicatorsMetrics'
                                    ),
                                    title: item.Name,
                                    value: value,
                                    label: label(
                                        'custom.FA_ReportViewActivitiesGraphKeyDuring'
                                    ),
                                };
                            }
                        }
                    });
                    // Split indicators into Two groups 'People' & 'Custom'
                    const peopleIndicators = indicators.filter(
                        indicator =>
                            indicator &&
                            indicator.type ==
                                constants.TYPES.INDICATOR_PREDEFINED
                    );
                    const customIndicators = indicators.filter(
                        indicator =>
                            indicator &&
                            indicator.type == constants.TYPES.INDICATOR_CUSTOM
                    );

                    // Only add activities of type "intervention"
                    // Only add activities - if they have indicators
                    if (
                        activity.Activity_Type__c ==
                            constants.TYPES.ACTIVITY_INTERVENTION &&
                        stripUndefined(indicators).length > 0
                    ) {
                        accumulator.push({
                            title: title,
                            description: description,
                            location: location,
                            peopleIndicators: peopleIndicators,
                            customIndicators: customIndicators,
                            reportReflection: reportReflection,
                        });
                    }
                    return accumulator;
                },
                []
            );
            setActivities(activities);
        }
    }, []);

    return (
        <SectionWrapper
            id={asId(label('custom.FA_ReportWizardMenuActivities'))}>
            <SectionWrapper>
                <div className="flex justify-between mt-32">
                    <h3 className="t-h4">
                        {label(
                            'custom.FA_ReportViewSubHeadingActivitiesOverall'
                        )}
                    </h3>
                    <UpdateButton mode="report" baseUrl="activities" />
                </div>
            </SectionWrapper>

            {activities?.length > 0 &&
                activities?.map((item, index) => (
                    <div key={`a-${index}`}>
                        <SectionWrapper>
                            <ReportDetailCard
                                headline={item.title}
                                description={item.description}
                                items={[
                                    {
                                        label: label(
                                            'custom.FA_InitiativeViewActivityLocation'
                                        ),
                                        text: item.location,
                                    },
                                ]}
                            />
                        </SectionWrapper>
                        {item.peopleIndicators.length > 0 && (
                            <SectionWrapper>
                                <ChartCard
                                    useBorder={true}
                                    headline={
                                        item.peopleIndicators[0]?.groupTitle
                                    }
                                    items={item.peopleIndicators}
                                />
                            </SectionWrapper>
                        )}
                        {item.customIndicators.length > 0 && (
                            <SectionWrapper>
                                <ChartCard
                                    className="mt-24"
                                    useBorder={true}
                                    headline={
                                        item.customIndicators[0]?.groupTitle
                                    }
                                    items={item.customIndicators}
                                />
                            </SectionWrapper>
                        )}
                        <TextCard
                            hasBackground={true}
                            className="mt-32"
                            headline={label(
                                'custom.FA_ReportViewSubHeadingActivityReflections'
                            )}
                            body={item.reportReflection}
                        />
                        {index < activities.length - 1 && <DividerLine />}
                    </div>
                ))}
            {activities?.length < 1 && <SectionEmpty type="report" />}
        </SectionWrapper>
    );
};

ReportActivitiesComponent.propTypes = {
    initiative: t.object.isRequired,
    report: t.object.isRequired,
    constants: t.object.isRequired,
};

ReportActivitiesComponent.defaultProps = {};

export default ReportActivitiesComponent;
