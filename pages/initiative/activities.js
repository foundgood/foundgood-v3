// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useMetadata, useAuth } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import Button from 'components/button';
import SectionWrapper from 'components/_report/sectionWrapper';
import ReportDetailCard from 'components/_report/reportDetailCard';
import DividerLine from 'components/_report/dividerLine';
import ChartCard from 'components/_report/chartCard';

const ActivitiesComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Fetch initiative data
    const { initiative } = useInitiativeDataStore();

    // Hook: Metadata
    const { labelTodo, label, valueSet, log } = useMetadata();

    const [activities, setActivities] = useState();

    useEffect(() => {
        console.log(initiative);
        if (initiative._activities?.length > 0) {
            const descriptions = JSON.parse(initiative.Problem_Resolutions__c);
            const activities = initiative._activities.map((item, index) => {
                const title = `Activity #${index + 1}`;
                const successIndicators = item.Initiative_Activity_Success_Metrics__r?.records.map(
                    success => {
                        return success.Name;
                    }
                );

                return {
                    title: title,
                    description: descriptions[index].text,
                    location: 'Missing data',
                    successIndicators: successIndicators,
                };
            });
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

                {activities?.length &&
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
                                    <div className="t-h5">
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

                            {/* <SectionWrapper>
                                <div className="t-h5">Related goals</div>
                                <div className="p-8 mt-16 border-4 border-blue-10 rounded-4 t-sh5">
                                    Building an inspiring and enabling learning
                                    environment for the natural science in
                                    Primart and lower secondary school (basic
                                    school)
                                </div>
                                <div className="p-8 mt-16 border-4 border-blue-10 rounded-4 t-sh5">
                                    Building a strong voice for the importance
                                    of natural sciences in Primary and lower
                                    secondary school (basic school)
                                </div>
                            </SectionWrapper> */}
                        </div>
                    ))}
            </SectionWrapper>

            <SectionWrapper>ah</SectionWrapper>
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

export async function getStaticProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    };
}

ActivitiesComponent.propTypes = {
    pageProps: t.object,
};

ActivitiesComponent.defaultProps = {
    pageProps: {},
};

ActivitiesComponent.layout = 'initiative';

export default ActivitiesComponent;
