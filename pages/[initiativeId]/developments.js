// React
import React, { useState, useEffect } from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useMetadata, useAuth } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';
import { stripUndefined } from 'utilities';

// Components
import Button from 'components/button';
import ChartCard from 'components/_initiative/chartCard';
import ReportSharingCard from 'components/_initiative/reportSharingCard';
import DividerLine from 'components/_initiative/dividerLine';
import SectionWrapper from 'components/sectionWrapper';

const DevelopmentsComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Fetch initiative data
    const { initiative, CONSTANTS } = useInitiativeDataStore();
    const [activities, setActivities] = useState();
    const [results, setResults] = useState();

    // Hook: Metadata
    const { labelTodo, label } = useMetadata();

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
                                    let title;
                                    let label;

                                    if (
                                        item.Type__c ===
                                        CONSTANTS.TYPES.INDICATOR_PREDEFINED
                                    ) {
                                        // If gender is "Other" -> use "Gender_Other__c" field
                                        const gender =
                                            item.Gender__c ==
                                            CONSTANTS.TYPES
                                                .INDICATOR_GENDER_OTHER
                                                ? item.Gender_Other__c
                                                : item.Gender__c;
                                        title = `${gender} (age ${item.Lowest_Age__c}-${item.Highest_Age__c})`;
                                        label = labelTodo('Reached so far');
                                    } else {
                                        title = item.Name;
                                        label = labelTodo('Total so far');
                                    }

                                    const value = item.Target__c
                                        ? `${item.Current_Status__c} / ${item.Target__c}`
                                        : item.Current_Status__c;
                                    return {
                                        title: title,
                                        value: value,
                                        label: label,
                                    };
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
                        CONSTANTS.TYPES.ACTIVITY_DISSEMINATION
                        ? true
                        : false;
                })
                .map(item => {
                    let items = [];

                    // If activity has publications
                    if (item.Publication_Type__c) {
                        items = [
                            {
                                label: label(
                                    'custom.FA_InitiativeViewSharingPublicationType'
                                ),
                                text: item.Publication_Type__c,
                            },
                            {
                                label: label(
                                    'custom.FA_InitiativeViewSharingPublicationYear'
                                ),
                                text: item.Publication_Year__c,
                            },
                            {
                                label: label(
                                    'custom.FA_InitiativeViewSharingPublisher'
                                ),
                                text: item.Publication_Publisher__c,
                            },
                            {
                                label: label(
                                    'custom.FA_InitiativeViewSharingAuthor'
                                ),
                                text: item.Publication_Author__c,
                            },
                            {
                                label: label(
                                    'custom.FA_InitiativeViewSharingPublicationDOI'
                                ),
                                text: item.Publication_DOI__c,
                            },
                        ];
                    }
                    return {
                        headline: item.Things_To_Do__c,
                        label: item.Dissemination_Method__c,
                        tags: item.Audience_Tag__c?.split(';'),
                        items: items,
                    };
                });
            setResults(results);
        }
    }, [initiative]);

    return (
        <>
            <SectionWrapper>
                <div className="t-h1">Developments</div>
            </SectionWrapper>
            <SectionWrapper className="mt-32 bg-white rounded-8">
                <div className="flex justify-between">
                    <h2 className="t-h3">
                        {label('custom.FA_InitiativeViewIndicatorsHeading')}
                    </h2>
                    <Button variant="secondary">{labelTodo('Update')}</Button>
                </div>
                {/* Loop - by activity */}
                {activities &&
                    activities.map((item, index) => (
                        <div key={`i-${index}`} className="mt-32">
                            <h3 className="t-h4">{item.title}</h3>
                            {/* Split by type "People" && "Custom"*/}
                            <ChartCard items={item.indicators} />
                            {index < activities.length - 1 && <DividerLine />}
                        </div>
                    ))}
            </SectionWrapper>
            <SectionWrapper className="mt-32 bg-white rounded-8">
                <div className="flex justify-between">
                    <h2 className="t-h3">
                        {label('custom.FA_ReportViewSubHeadingSharingOverall')}
                    </h2>
                    <Button variant="secondary">{labelTodo('Update')}</Button>
                </div>
                {results &&
                    results.map((item, index) => (
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
            </SectionWrapper>

            {/* 
            STATIC VERSION!!!
            <SectionWrapper className="mt-32 bg-white rounded-8">
                <div className="flex justify-between">
                    <h2 className="t-h3">{labelTodo('Sharing of results')}</h2>
                    <Button variant="secondary">{labelTodo('Update')}</Button>
                </div>
                <div className="mt-24">
                    <ReportSharingCard
                        headline="Science Weekly 🔬"
                        description="Journal publication"
                        tags={[
                            'Policymakers',
                            'Politicians',
                            'Professional practitioners',
                        ]}
                        items={[
                            {
                                label: 'Publication type',
                                text: 'Industry magazine',
                            },
                            { label: 'Publication year', text: '2021' },
                            {
                                label: 'Publisher',
                                text: 'Media company publishing international',
                            },
                            { label: 'Author', text: 'Uganda, Denmark' },
                            { label: 'DOI', text: 'Uganda, Denmark' },
                        ]}
                    />
                    <div className="py-24">
                        <DividerLine />
                    </div>
                </div>

                <div className="mt-24">
                    <ReportSharingCard
                        headline="The Joe Rogan Podcast 💪"
                        description="TV/radio/film/podcast"
                        tags={[
                            'Policymakers',
                            'Politicians',
                            'Professional practitioners',
                        ]}
                    />
                    <div className="py-24">
                        <DividerLine />
                    </div>
                </div>

                <div className="mt-24">
                    <ReportSharingCard
                        headline="Elsewhere Essence Workhop 👯🤯🥴"
                        description="Workshop or similar"
                        tags={[
                            'Policymakers',
                            'Politicians',
                            'Professional practitioners',
                        ]}
                    />
                    <div className="py-24">
                        <DividerLine />
                    </div>
                </div>
            </SectionWrapper>
            
            <SectionWrapper className="bg-white rounded-8">
                <div className="flex justify-between">
                    <h2 className="t-h3">{labelTodo('Indicator totals')}</h2>
                    <Button variant="secondary">{labelTodo('Update')}</Button>
                </div>

                <ChartCard
                    items={[
                        {
                            title: 'Children (age 0-5)',
                            value: '256',
                            label: 'Reached so far',
                        },
                        {
                            title: 'Adults (24+)',
                            value: '384',
                            label: 'Reached so far',
                        },
                        {
                            title: 'Schools built',
                            value: '12',
                            label: 'Total so far',
                        },
                        {
                            title: 'Wells built',
                            value: '24',
                            label: 'Total so far',
                        },
                    ]}
                />
            </SectionWrapper>

            <SectionWrapper className="mt-32 bg-white rounded-8">
                <div className="flex justify-between">
                    <h2 className="t-h3">{labelTodo('Indicator targets')}</h2>
                    <Button variant="secondary">{labelTodo('Update')}</Button>
                </div>

                <ChartCard
                    items={[
                        {
                            title: 'Children (age 0-5)',
                            value: '256 / 512',
                            label: 'Reached so far',
                        },
                        {
                            title: 'Adults (24+)',
                            value: '384 / 256',
                            label: 'Reached so far',
                        },
                        {
                            title: 'Schools built',
                            value: '12/18',
                            label: 'Total so far',
                        },
                        {
                            title: 'Wells built',
                            value: '24/32',
                            label: 'Total so far',
                        },
                    ]}
                />
            </SectionWrapper>

            <SectionWrapper className="mt-32 bg-white rounded-8">
                <div className="flex justify-between">
                    <h2 className="t-h3">{labelTodo('Evaluations')}</h2>
                    <Button variant="secondary">{labelTodo('Update')}</Button>
                </div>
                <div className="mt-24">
                    <p className="t-body">
                        Physiological respiration involves the mechanisms that
                        ensure that the composition of the functional residual
                        capacity is kept constant.
                    </p>
                    <div className="mt-16 t-h4">Evaluator name #1</div>
                    <DividerLine />
                </div>
                <div className="mt-24">
                    <p className="t-body">
                        Physiological respiration involves the mechanisms that
                        ensure that the composition of the functional residual
                        capacity is kept constant.
                    </p>
                    <div className="mt-16 t-h4">Evaluator name #2</div>
                </div>
            </SectionWrapper>

            <SectionWrapper className="mt-32 bg-white rounded-8">
                <div className="flex justify-between">
                    <h2 className="t-h3">{labelTodo('Outcomes')}</h2>
                    <Button variant="secondary">{labelTodo('Update')}</Button>
                </div>
                <div className="mt-24">
                    <h3 className="t-h4">{labelTodo('Outcome #1')}</h3>
                    <p className="t-body">
                        Physiological respiration involves the mechanisms that
                        ensure that the composition of the functional residual
                        capacity is kept constant.
                    </p>
                    <div className="p-8 mt-16 border-4 border-blue-10 rounded-4 t-sh5">
                        Building an inspiring and enabling learning environment
                        for the natural science in Primart and lower secondary
                        school (basic school)
                    </div>
                    <div className="p-8 mt-16 border-4 border-blue-10 rounded-4 t-sh5">
                        Building a strong voice for the importance of natural
                        sciences in Primary and lower secondary school (basic
                        school)
                    </div>
                    <DividerLine />
                </div>

                <div className="mt-24">
                    <h3 className="t-h4">{labelTodo('Outcome #2')}</h3>
                    <p className="t-body">
                        Physiological respiration involves the mechanisms that
                        ensure that the composition of the functional residual
                        capacity is kept constant.
                    </p>
                    <div className="p-8 mt-16 border-4 border-blue-10 rounded-4 t-sh5">
                        Building an inspiring and enabling learning environment
                        for the natural science in Primart and lower secondary
                        school (basic school)
                    </div>
                    <div className="p-8 mt-16 border-4 border-blue-10 rounded-4 t-sh5">
                        Building a strong voice for the importance of natural
                        sciences in Primary and lower secondary school (basic
                        school)
                    </div>
                </div>
            </SectionWrapper>

            <SectionWrapper className="mt-32 bg-white rounded-8">
                <div className="flex justify-between">
                    <h2 className="t-h3">{labelTodo('Influence on policy')}</h2>
                    <Button variant="secondary">{labelTodo('Update')}</Button>
                </div>
                <div className="mt-24">
                    <div className="t-h4">Influence #1</div>
                    <p className="mt-16 t-body">
                        Physiological respiration involves the mechanisms that
                        ensure that the composition of the functional residual
                        capacity is kept constant.
                    </p>
                    <DividerLine />
                </div>
                <div className="mt-24">
                    <div className="t-h4">Evaluator name #2</div>
                    <p className="mt-16 t-body">
                        Physiological respiration involves the mechanisms that
                        ensure that the composition of the functional residual
                        capacity is kept constant.
                    </p>
                </div>
            </SectionWrapper> */}
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

export default DevelopmentsComponent;
