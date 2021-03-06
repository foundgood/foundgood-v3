// React
import React, { useState, useEffect } from 'react';

// Packages
import t from 'prop-types';
import dayjs from 'dayjs';

// Utilities
import { stripUndefined, getPermissionRules } from 'utilities';
import { useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import Preloader from 'components/preloader';
import Footer from 'components/_layout/footer';
import UpdateButton from 'components/updateButton';
import SectionWrapper from 'components/sectionWrapper';
import SectionEmpty from 'components/sectionEmpty';
import ChartCard from 'components/_initiative/chartCard';
import ReportSharingCard from 'components/_initiative/reportSharingCard';
import DividerLine from 'components/_initiative/dividerLine';

const DevelopmentsComponent = ({ pageProps }) => {
    // Fetch initiative data
    const { initiative, CONSTANTS } = useInitiativeDataStore();
    const [activities, setActivities] = useState();
    const [results, setResults] = useState();

    // Hook: Metadata
    const { getValueLabel, label } = useLabels();

    useEffect(() => {
        // Make sure data it loaded
        if (
            initiative?._activitySuccessMetrics &&
            Object.keys(initiative?._activitySuccessMetrics).length !== 0
        ) {
            // Example of object:
            // [
            //     {
            //         title: 'Activity name',
            //         indicators: [
            //             {
            //                 title: 'T-shirts produced',
            //                 value: '1 / 10',
            //                 label: 'Total so far',
            //             },
            //             {
            //                 title: 'Meetings attneded',
            //                 value: '5 / 10',
            //                 label: 'Reached so far',
            //             },
            //         ],
            //     },
            // ];

            // Create list of indicators per "Activity"
            const activities = Object.values(initiative._activities).reduce(
                (accumulator, activity) => {
                    const title = activity.Things_To_Do__c;

                    // Loop indicators
                    // Add indicators if it matches the activity ID
                    const indicators = stripUndefined(
                        Object.values(initiative._activitySuccessMetrics).map(
                            item => {
                                if (
                                    activity.Id == item.Initiative_Activity__c
                                ) {
                                    // ? `${item.Current_Status__c} / ${item.Target__c}` // Removed until wizard section is built
                                    const value = item.Target__c
                                        ? `${item.Current_Status__c}`
                                        : item.Current_Status__c;
                                    if (
                                        item.Type__c ===
                                        CONSTANTS.ACTIVITY_SUCCESS_METRICS
                                            .INDICATOR_PREDEFINED
                                    ) {
                                        let headline;
                                        // Get gender
                                        const gender = item.Gender__c
                                            ? getValueLabel(
                                                  'Initiative_Activity_Success_Metric__c.Gender__c',
                                                  item.Gender__c
                                              )
                                            : '';
                                        const genderOther = item.Gender_Other__c
                                            ? ` ${item.Gender_Other__c}`
                                            : '';

                                        // Get KPI
                                        const kpi = item.KPI__c
                                            ? ` ${getValueLabel(
                                                  'Initiative_Activity_Success_Metric__c.KPI__c',
                                                  item.KPI__c,
                                                  true
                                              )} `
                                            : '';

                                        headline = `${gender}${genderOther}${kpi}`;

                                        return {
                                            title: headline,
                                            value: value,
                                            label: label(
                                                'InitiativeViewMetricsTotal'
                                            ),
                                        };
                                    } else {
                                        return {
                                            title: item.Name,
                                            value: value,
                                            label: label(
                                                'InitiativeViewMetricsTotal'
                                            ),
                                        };
                                    }
                                }
                            }
                        )
                    );

                    // Only add activities - if they have indicators
                    if (indicators.length > 0) {
                        accumulator.push({
                            title: title,
                            indicators: indicators,
                        });
                    }
                    return accumulator;
                },
                []
            );
            setActivities(activities);

            // Get all 'Dissemination' activities
            const results = Object.values(initiative._activities)
                .filter(item => {
                    // "Dissemination" or "Intervention"
                    return item.Activity_Type__c ==
                        CONSTANTS.ACTIVITIES.ACTIVITY_DISSEMINATION
                        ? true
                        : false;
                })
                .map(item => {
                    let items = [];

                    getValueLabel(
                        'initiativeActivitySuccessMetric.Gender__c',
                        item.Gender__c
                    );

                    // If activity has publications
                    if (item.Publication_Type__c) {
                        items = [
                            {
                                label: label(
                                    'InitiativeViewSharingPublicationType'
                                ),
                                text: item.Publication_Type__c,
                            },
                            {
                                label: label(
                                    'InitiativeViewSharingPublicationYear'
                                ),
                                text: dayjs(item.Publication_Year__c).format(
                                    'YYYY'
                                ),
                            },
                            {
                                label: label('InitiativeViewSharingPublisher'),
                                text: item.Publication_Publisher__c,
                            },
                            {
                                label: label('InitiativeViewSharingAuthor'),
                                text: item.Publication_Author__c,
                            },
                            {
                                label: label(
                                    'InitiativeViewSharingPublicationDOI'
                                ),
                                text: item.Publication_DOI__c,
                            },
                        ];
                    }
                    return {
                        headline: item.Things_To_Do__c,
                        label: getValueLabel(
                            'Initiative_Activity__c.Dissemination_Method__c',
                            item.Dissemination_Method__c
                        ),
                        tags: item.Audience_Tag__c?.split(';').map(tag =>
                            getValueLabel(
                                'Initiative_Activity__c.Audience_Tag__c',
                                tag
                            )
                        ),
                        items: items,
                    };
                });
            setResults(results);
        } else if (
            initiative?.Id &&
            Object.keys(initiative?._activitySuccessMetrics).length < 1
        ) {
            setActivities([]);
            setResults([]);
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
                        <div className="t-h1">{label('MenuDevelopments')}</div>
                    </SectionWrapper>
                    <SectionWrapper className="mt-32 bg-white rounded-8">
                        <div className="flex justify-between">
                            <h2 className="t-h3">
                                {label('InitiativeViewIndicatorsHeading')}
                            </h2>
                            <UpdateButton
                                {...{
                                    baseUrl: 'indicators',
                                    rules: getPermissionRules(
                                        'initiative',
                                        'indicators',
                                        'update'
                                    ),
                                }}
                            />
                        </div>
                        {/* Loop - by activity */}
                        {activities?.length > 0 &&
                            activities?.map((item, index) => (
                                <div key={`i-${index}`} className="mt-32">
                                    <h3 className="t-h4">{item.title}</h3>
                                    {/* Split by type "People" && "Custom"*/}
                                    <ChartCard items={item.indicators} />
                                    {index < activities.length - 1 && (
                                        <DividerLine />
                                    )}
                                </div>
                            ))}
                        {/* Empty state - No activities */}
                        {activities?.length < 1 && (
                            <SectionEmpty type="initiative" />
                        )}
                    </SectionWrapper>
                    <SectionWrapper className="mt-32 bg-white rounded-8">
                        <div className="flex justify-between">
                            <h2 className="t-h3">
                                {label('ReportViewSubHeadingSharingOverall')}
                            </h2>
                            <UpdateButton
                                mode="initiative"
                                baseUrl="sharing-results"
                            />
                        </div>
                        {results?.length > 0 &&
                            results?.map((item, index) => (
                                <div key={`a-${index}`} className="mt-24">
                                    <ReportSharingCard
                                        key={`r-${index}`}
                                        headline={item.headline}
                                        description={item.label}
                                        tags={item.tags}
                                        items={item.items}
                                    />
                                    {index < results.length - 1 && (
                                        <div className="py-24">
                                            <DividerLine />
                                        </div>
                                    )}
                                </div>
                            ))}
                        {/* Empty state - No results */}
                        {results?.length < 1 && (
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

DevelopmentsComponent.propTypes = {
    pageProps: t.object,
};

DevelopmentsComponent.defaultProps = {
    pageProps: {},
};

DevelopmentsComponent.layout = 'initiative';

export default WithAuth(DevelopmentsComponent);
