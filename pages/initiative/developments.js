// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useMetadata, useAuth } from 'utilities/hooks';

// Components
import Button from 'components/button';
import ChartCard from 'components/_report/chartCard';
import ReportSharingCard from 'components/_report/reportSharingCard';
import DividerLine from 'components/_report/dividerLine';
import SectionWrapper from 'components/_report/sectionWrapper';

const DevelopmentsComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo, label, valueSet, log } = useMetadata();

    return (
        <>
            <SectionWrapper>
                <div className="t-h1">Developments</div>
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
                    <h2 className="t-h3">
                        {labelTodo('Indicators by activity')}
                    </h2>
                    <Button variant="secondary">{labelTodo('Update')}</Button>
                </div>

                {/* Loop - by activity */}
                <div className="mt-32">
                    <h3 className="t-h4">{labelTodo('Activity #1 name')}</h3>
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
                        ]}
                    />
                    <DividerLine />
                </div>
                <div className="mt-32">
                    <h3 className="t-h4">{labelTodo('Activity #2 name')}</h3>
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
                        ]}
                    />
                </div>
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
            </SectionWrapper>
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
