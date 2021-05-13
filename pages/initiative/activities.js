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

    useEffect(() => {
        console.log(initiative);
    }, [initiative]);

    return (
        <>
            <SectionWrapper>
                <div className="t-h1">Activities</div>
            </SectionWrapper>

            {/* Activity #1 */}
            <div className="bg-white rounded-8">
                <SectionWrapper>
                    <div className="flex justify-between">
                        <h2 className="t-h3">{labelTodo('Activities')}</h2>
                        <Button variant="secondary">
                            {labelTodo('Update')}
                        </Button>
                    </div>
                </SectionWrapper>

                <ReportDetailCard
                    headline="Activity #1 name"
                    description="Physiological respiration involves the mechanisms that ensure that the composition of the functional residual capacity is kept constant. "
                    items={[{ label: 'Location', text: 'Uganda, Denmark' }]}
                />

                <SectionWrapper>
                    <div className="t-h5">Success indicators</div>
                    <div className="p-8 mt-16 bg-blue-10 rounded-4 t-sh5">
                        Reaching other (not specified) Adults (24+)
                    </div>
                    <div className="p-8 mt-16 bg-blue-10 rounded-4 t-sh5">
                        I found a guinea pig and named it Horace
                    </div>
                </SectionWrapper>
                <SectionWrapper>
                    <div className="t-h5">Related goals</div>
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
                </SectionWrapper>

                {/* Activity #2 */}
                <SectionWrapper paddingY={false}>
                    <DividerLine />
                </SectionWrapper>

                <ReportDetailCard
                    headline="Activity #2 name"
                    description="Physiological respiration involves the mechanisms that ensure that the composition of the functional residual capacity is kept constant. "
                    items={[{ label: 'Location', text: 'Uganda, Denmark' }]}
                />

                <SectionWrapper>
                    <div className="t-h5">Success indicators</div>
                    <div className="p-8 mt-16 bg-blue-10 rounded-4 t-sh5">
                        Reaching other (not specified) Adults (24+)
                    </div>
                    <div className="p-8 mt-16 bg-blue-10 rounded-4 t-sh5">
                        I found a guinea pig and named it Horace
                    </div>
                </SectionWrapper>
                <SectionWrapper>
                    <div className="t-h5">Related goals</div>
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
                </SectionWrapper>
            </div>

            {/* Indicators */}
            <div className="bg-white rounded-8">
                <div className="flex justify-between">
                    <h2 className="t-h3">{labelTodo('Activities')}</h2>
                    <Button variant="secondary">{labelTodo('Update')}</Button>
                </div>
                <ChartCard
                    items={[
                        { title: 'Schools built' },
                        { title: 'Wells built' },
                    ]}
                />

                {/* <ChartCard
                    label="Reached so far"
                    items={[
                        { title: 'Schools built', value: '12', label: 'Reached so far' },
                        { title: 'Wells built', value: '24', label: 'Reached so far'},
                    ]}
                /> */}
            </div>
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
