// React
import React, { useState, useEffect } from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useMetadata, useAuth } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

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
    const { initiative } = useInitiativeDataStore();
    const [indicatorsPerActivity, setIndicatorsPerActivity] = useState();
    const [activities, setActivities] = useState();

    // Hook: Metadata
    const { labelTodo, label, valueSet, log } = useMetadata();

    useEffect(() => {
        console.log(initiative);
        if (initiative._activitySuccessMetrics) {
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
            const indicatorsPerActivity = Object.values(
                initiative._activities
            ).reduce((accumulator, activity, currentIndex, array) => {
                const title = activity.Things_To_Do__c;

                // Loop indicators
                // Add indicators if it matches the activity ID
                const indicators = Object.values(
                    initiative._activitySuccessMetrics
                ).map(item => {
                    if (activity.Id == item.Initiative_Activity__c) {
                        let title;
                        let label;
                        if (item.Type__c === 'People') {
                            // If gender is "Other" -> use "Gender_Other__c" field
                            const gender =
                                item.Gender__c == 'Other'
                                    ? item.Gender_Other__c
                                    : item.Gender__c;
                            title = `${gender} (age ${item.Lowest_Age__c}-${item.Highest_Age__c})`;
                            label = labelTodo('Reached so far');
                        } else {
                            title = item.Name;
                            label = labelTodo('Total so far');
                        }

                        return {
                            title: title,
                            value: `${item.Progress__c} / ${item.Target__c}`,
                            current: item.Progress__c,
                            total: item.Target__c,
                            label: label,
                        };
                    }
                });

                // Only add activities - if they have indicators
                if (stripUndefined(indicators).length > 0) {
                    accumulator.push({
                        title: title,
                        indicators: indicators,
                    });
                }
                return accumulator;
            }, []);
            setIndicatorsPerActivity(indicatorsPerActivity);

            // Get all 'Dissemination' activities
            let activities = Object.values(initiative._activities).filter(
                item => {
                    // "Dissemination" or "Intervention"
                    return item.Activity_Type__c == 'Dissemination'
                        ? true
                        : false;
                }
            );
            activities = activities.map(item => {
                let items = [];

                // If activity has publications
                if (item.Publication_Type__c) {
                    items = [
                        {
                            label: labelTodo('Publication type'),
                            text: item.Publication_Type__c,
                        },
                        {
                            label: labelTodo('Publication year'),
                            text: item.Publication_Year__c,
                        },
                        {
                            label: labelTodo('Publisher'),
                            text: item.Publication_Publisher__c,
                        },
                        {
                            label: labelTodo('Author'),
                            text: item.Publication_Author__c,
                        },
                        {
                            label: labelTodo('DOI'),
                            text: item.Publication_DOI__c,
                        },
                    ];
                }
                return {
                    headline: item.Things_To_Do__c,
                    label: item.Dissemination_Method__c,
                    tags: item.Audience_Tag__c.split(';'),
                    items: items,
                };
            });
            console.log('Wop: ', activities);
            setActivities(activities);
        }
    }, [initiative]);

    // Remove undefined values from array
    const stripUndefined = array => {
        var result = [];
        array.forEach(function (item) {
            if (Array.isArray(item) && item.length != 0) {
                // Item is a nested array, go one level deeper recursively
                result.push(stripUndefined(item));
            } else if (typeof item !== 'undefined') {
                result.push(item);
            }
        });
        return result;
    };

    return (
        <>
            <SectionWrapper>
                <div className="t-h1">Developments</div>
            </SectionWrapper>
            <SectionWrapper className="mt-32 bg-white rounded-8">
                <div className="flex justify-between">
                    <h2 className="t-h3">
                        {labelTodo('Indicators by activity')}
                    </h2>
                    <Button variant="secondary">{labelTodo('Update')}</Button>
                </div>
                {/* Loop - by activity */}
                {indicatorsPerActivity &&
                    indicatorsPerActivity.map((item, index) => (
                        <div key={`i-${index}`} className="mt-32">
                            <h3 className="t-h4">{item.title}</h3>
                            {/* Loop by activity */}
                            <ChartCard items={item.indicators} />
                            {index < indicatorsPerActivity.length - 1 && (
                                <DividerLine />
                            )}
                        </div>
                    ))}
            </SectionWrapper>
            <SectionWrapper className="mt-32 bg-white rounded-8">
                <div className="flex justify-between">
                    <h2 className="t-h3">{labelTodo('Sharing of results')}</h2>
                    <Button variant="secondary">{labelTodo('Update')}</Button>
                </div>
                {activities &&
                    activities.map((item, index) => (
                        <div className="mt-24">
                            <ReportSharingCard
                                key={`r-${index}`}
                                headline={item.headline}
                                label={item.label}
                                tags={item.tags}
                                items={item.items}
                            />
                            {index < activities.length - 1 && (
                                <div className="py-24">
                                    <DividerLine />
                                </div>
                            )}
                        </div>
                    ))}
            </SectionWrapper>

            {/* 
            <SectionWrapper className="mt-32 bg-white rounded-8">
                <div className="flex justify-between">
                    <h2 className="t-h3">{labelTodo('Sharing of results')}</h2>
                    <Button variant="secondary">{labelTodo('Update')}</Button>
                </div>
                <div className="mt-24">
                    <ReportSharingCard
                        headline="Science Weekly 🔬"
                        label="Journal publication"
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
                        label="TV/radio/film/podcast"
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
                        label="Workshop or similar"
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

export async function getStaticProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    };
}

DevelopmentsComponent.propTypes = {
    pageProps: t.object,
};

DevelopmentsComponent.defaultProps = {
    pageProps: {},
};

DevelopmentsComponent.layout = 'initiative';

export default DevelopmentsComponent;
