// React
import React from 'react';

// Packages
import Image from 'next/image';
import t from 'prop-types';

// Utilities
import { useMetadata, useAuth } from 'utilities/hooks';

// Components
import SectionWrapper from 'components/_report/sectionWrapper';
import ReportDetailCard from 'components/_report/reportDetailCard';
import ReportSharingCard from 'components/_report/reportSharingCard';
import TextCard from 'components/_report/textCard';
import NumberCard from 'components/_report/numberCard';
import DividerLine from 'components/_report/dividerLine';
import ChartCard from 'components/_report/chartCard';

const ReportComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo, label, valueSet, log } = useMetadata();

    return (
        <>
            {/* Header */}
            <SectionWrapper>
                <SectionWrapper>
                    <div className="w-64 h-64 overflow-hidden rounded-4">
                        <Image
                            src="/images/fg-card-square-1.png"
                            width="64"
                            height="64"></Image>
                    </div>
                    <div className="mt-16">{labelTodo('SOS Børnebyerne')}</div>

                    <div className="mt-48 t-h1">
                        {labelTodo(
                            'Coastal Hazard Wheel – Global coastal disaster prevention & recovery project'
                        )}
                    </div>
                    <div className="mt-16 t-sh2">
                        {labelTodo('Annual report 2021')}
                    </div>
                    <div className="flex mt-16 t-caption text-blue-60">
                        {labelTodo('NN123456789AAS')}
                        <div className="mx-4">•</div>
                        {labelTodo('In progress')}
                    </div>
                </SectionWrapper>
            </SectionWrapper>
            {/* Overview */}
            <SectionWrapper>
                {/* <div className="p-16 md:p-32 xl:px-64"> */}
                <SectionWrapper>
                    <h2 className="t-h4">{labelTodo('Overview')}</h2>
                    <h3 className="mt-24 t-preamble">
                        {labelTodo(
                            'This initiative is here to help people. We’ve created it because we care about a and it fits very well with the foundations strategic aims. It really is great read on and you’ll find out all about it'
                        )}
                    </h3>
                </SectionWrapper>
                {/* Information cards */}
                {/* <div className="flex flex-col items-start md:flex-row"> */}
                <div className="inline-grid items-start w-full grid-cols-1 md:grid-cols-2 md:gap-24">
                    <div className="p-16 mb-20 border-4 border-gray-10 rounded-8">
                        <div className="t-sh6 text-blue-60">
                            {labelTodo('Grant giving area')}
                        </div>
                        <h3 className="t-h5">{labelTodo('Humanitarian')}</h3>
                        <div className="mt-16 t-sh6 text-blue-60">
                            {labelTodo('Novo Nordisk Foundation theme')}
                        </div>
                        <h3 className="t-h5">
                            {labelTodo(
                                'Responding to acute humanitarian crises'
                            )}
                        </h3>
                        <div className="mt-16 t-sh6 text-blue-60">
                            {labelTodo('Additional goals')}
                        </div>
                        <h3 className="t-h5">
                            {labelTodo(
                                'Exercitation veniam amet consequat sunt nostrud '
                            )}
                        </h3>
                        <div className="mt-16 t-sh6 text-blue-60">
                            {labelTodo('Sustainable development goals')}
                        </div>
                        <h3 className="t-h5">
                            <span className="px-6 pt-4 mr-4 leading-none text-white bg-teal-300 rounded-4">
                                {labelTodo('6')}
                            </span>
                            {labelTodo('Clean water and sanitation')}
                        </h3>
                    </div>
                    <div className="p-16 mb-20 border-4 border-gray-10 rounded-8">
                        <div className="t-sh6 text-blue-60">
                            {labelTodo('Grant start and end date')}
                        </div>
                        <h3 className="t-h5">
                            {labelTodo('July 7 2020 – July 6 2021')}
                        </h3>
                        <div className="mt-16 t-sh6 text-blue-60">
                            {labelTodo('Initiative location')}
                        </div>
                        <h3 className="t-h5">
                            {labelTodo('Uganda & Denmark')}
                        </h3>
                    </div>
                    <div className="p-16 mb-20 border-4 border-gray-10 rounded-8">
                        <div className="t-sh6 text-blue-60">
                            {labelTodo('Co-funders')}
                        </div>
                        <div className="">
                            <h3 className="t-h5">
                                {labelTodo('Leo Foundation')}
                            </h3>
                            <h3 className="t-h5">
                                {labelTodo('Ole Kirk’s Fond')}
                            </h3>
                        </div>

                        <div className="mt-16 t-sh6 text-blue-60">
                            {labelTodo('Co-applicants')}
                        </div>
                        <h3 className="t-h5">
                            {labelTodo(
                                'Elsewhere, Remotely, FoundAid, Robinson, Studion'
                            )}
                        </h3>
                    </div>
                    <div className="p-16 mb-20 border-4 border-gray-10 rounded-8">
                        <div className="t-sh6 text-blue-60">
                            {labelTodo(
                                'Amount granted by Novo Nordisk Foundation'
                            )}
                        </div>
                        <h3 className="t-h5">{labelTodo('DKK 15.000.000')}</h3>

                        <div className="mt-16 t-sh6 text-blue-60">
                            {labelTodo('Share of total funding')}
                        </div>
                        <h3 className="t-h5">{labelTodo('67%')}</h3>
                    </div>
                </div>
            </SectionWrapper>
            {/* Funders */}
            <SectionWrapper>
                <SectionWrapper>
                    <h3 className="t-h4">{labelTodo('Funders')}</h3>
                </SectionWrapper>

                {/* Donut chart */}
                <div className="flex items-center p-16 border-4 rounded-8 border-amber-10">
                    {/* Pie chart */}
                    <div className="w-1/2 t-h1">
                        <h1>🍩 CHART</h1>
                    </div>
                    <div className="w-1/2">
                        {/* Headline */}
                        <div className="t-caption-bold">
                            Funders and contributions overall
                        </div>
                        {/* List of funders */}
                        <div className="flex mt-8 t-caption">
                            <span className="w-16 h-16 mr-8 bg-blue-60 rounded-2"></span>
                            Novo Nordisk Foundation – DKK 1.000.000
                        </div>
                        <div className="flex mt-8 t-caption">
                            <span className="w-16 h-16 mr-8 bg-amber-60 rounded-2"></span>
                            Novo Nordisk Foundation – DKK 1.000.000
                        </div>
                        <div className="flex mt-8 t-caption">
                            <span className="w-16 h-16 mr-8 bg-coral-60 rounded-2"></span>
                            Co-funder name – DKK 250.000
                        </div>
                        <div className="flex mt-8 t-caption">
                            <span className="w-16 h-16 mr-8 bg-teal-60 rounded-2"></span>
                            Additional funder name – DKK 250.000
                        </div>
                    </div>
                </div>

                {/* List of funders */}
                <>
                    <SectionWrapper>
                        <ReportDetailCard
                            headline="Co-funder name"
                            image="/images/fg-card-square-1.png"
                            description="Physiological respiration involves the mechanisms that ensure that the composition of the functional residual capacity is kept constant."
                            items={[
                                { label: 'Amount', text: 'DKK 500.000' },
                                {
                                    label: 'Approval date',
                                    text: 'June 15th 2020',
                                },
                            ]}
                        />
                    </SectionWrapper>

                    <SectionWrapper className="bg-blue-10 rounded-8">
                        <div className="t-h5">Updates from this year</div>
                        <p className="mt-8 t-body">
                            In the eighteenth century the German philosopher
                            Immanuel Kant developed a theory of knowledge in
                            which knowledge about space can be both a priori and
                            synthetic. According to Kant, knowledge about space
                            is synthetic, in that statements about space are not
                            simply true by virtue of the meaning of the words in
                            the statement.
                        </p>
                    </SectionWrapper>
                </>
            </SectionWrapper>
            {/* Report Summary */}
            <SectionWrapper>
                <SectionWrapper>
                    <h2 className="t-h4">{labelTodo('Report summary')}</h2>
                </SectionWrapper>
                <TextCard
                    hasBackground={true}
                    headline="Overall perfomance"
                    body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement."
                />
                <TextCard
                    hasBackground={true}
                    className="mt-32"
                    headline="Challenges & Learnings"
                    body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement."
                />
            </SectionWrapper>
            {/* ------------------------------------------------------------------------------------------ */}
            {/* Key changes */}
            <SectionWrapper>
                <SectionWrapper className="mt-96">
                    <h2 className="t-h3">{labelTodo('Key changes')}</h2>
                </SectionWrapper>
                <SectionWrapper>
                    <h3 className="t-h4">
                        {labelTodo('New co-applicant relationships this year')}
                    </h3>
                </SectionWrapper>

                <SectionWrapper>
                    <ReportDetailCard
                        headline="Co-funder name"
                        image="/images/fg-card-square-1.png"
                        description="Physiological respiration involves the mechanisms that ensure that the composition of the functional residual capacity is kept constant."
                        items={[
                            { label: 'Amount', text: 'DKK 500.000' },
                            { label: 'Approval date', text: 'June 15th 2020' },
                        ]}
                    />
                </SectionWrapper>
                <TextCard
                    hasBackground={true}
                    headline="Updates from this year"
                    body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement."
                />
                <SectionWrapper>
                    <ReportDetailCard
                        headline="Co-funder name"
                        image="/images/fg-card-square-1.png"
                        description="Physiological respiration involves the mechanisms that ensure that the composition of the functional residual capacity is kept constant."
                        items={[
                            { label: 'Amount', text: 'DKK 500.000' },
                            { label: 'Approval date', text: 'June 15th 2020' },
                        ]}
                    />
                </SectionWrapper>
                <TextCard
                    hasBackground={true}
                    headline="Updates from this year"
                    body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement."
                />
            </SectionWrapper>
            {/* ------------------------------------------------------------------------------------------ */}
            {/* Overview of collaborations */}
            <SectionWrapper>
                <SectionWrapper>
                    <h3 className="t-h4">
                        {labelTodo('Overview of collaborations')}
                    </h3>
                </SectionWrapper>

                <SectionWrapper>
                    <ReportDetailCard
                        headline="Co-funder name"
                        image="/images/fg-card-square-1.png"
                        description="Physiological respiration involves the mechanisms that ensure that the composition of the functional residual capacity is kept constant."
                        items={[
                            { label: 'Amount', text: 'DKK 500.000' },
                            { label: 'Approval date', text: 'June 15th 2020' },
                        ]}
                    />
                </SectionWrapper>
                <TextCard
                    hasBackground={true}
                    headline="Updates from this year"
                    body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement."
                />
                <SectionWrapper>
                    <ReportDetailCard
                        headline="Co-funder name"
                        image="/images/fg-card-square-1.png"
                        description="Physiological respiration involves the mechanisms that ensure that the composition of the functional residual capacity is kept constant."
                        items={[
                            { label: 'Amount', text: 'DKK 500.000' },
                            { label: 'Approval date', text: 'June 15th 2020' },
                        ]}
                    />
                </SectionWrapper>
                <TextCard
                    hasBackground={true}
                    headline="Updates from this year"
                    body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement."
                />
            </SectionWrapper>
            {/* ------------------------------------------------------------------------------------------ */}
            {/* Employees funded by the grant */}
            <SectionWrapper>
                <SectionWrapper>
                    <h3 className="t-h4">
                        {labelTodo('Employees funded by the grant')}
                    </h3>
                </SectionWrapper>

                <div className="inline-grid w-full grid-cols-2 gap-16 mt-16 md:grid-cols-4 2xl:grid-cols-6">
                    <NumberCard
                        number="6"
                        headline="Researchers"
                        description="4 female, 2 male"
                    />
                    <NumberCard
                        number="2"
                        headline="Project managers"
                        description="2 male"
                    />
                    <NumberCard
                        number="5"
                        headline="Administrative staff"
                        description="3 female, 2 male"
                    />
                    <NumberCard
                        number="6"
                        headline="Technical staff"
                        description="4 female, 2 male"
                    />
                    <NumberCard
                        number="20"
                        headline="Other"
                        description="10 female, 10 male"
                    />
                    <NumberCard
                        number="3"
                        headline="Scientists"
                        description="3 female"
                    />
                </div>
            </SectionWrapper>
            {/* ------------------------------------------------------------------------------------------ */}
            {/* Goals */}
            <SectionWrapper>
                <SectionWrapper>
                    <h3 className="t-h4">{labelTodo('Goals')}</h3>
                </SectionWrapper>
                <TextCard
                    hasBackground={false}
                    className="mt-32"
                    headline="Updates from this year"
                    label="Custom"
                />

                <TextCard
                    hasBackground={true}
                    className="mt-32"
                    headline="Updates from this year"
                    body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement."
                />
                <DividerLine />

                <TextCard
                    hasBackground={false}
                    className="mt-32"
                    headline="Updates from this year"
                    label="Custom"
                />

                <TextCard
                    hasBackground={true}
                    className="mt-32"
                    headline="Updates from this year"
                    body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement."
                />
                <DividerLine />

                <TextCard
                    hasBackground={false}
                    className="mt-32"
                    headline="Updates from this year"
                    label="Custom"
                />

                <TextCard
                    hasBackground={true}
                    className="mt-32"
                    headline="Updates from this year"
                    body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement."
                />
            </SectionWrapper>
            {/* ------------------------------------------------------------------------------------------ */}
            {/* Activities */}
            <SectionWrapper>
                <SectionWrapper>
                    <h3 className="t-h4">{labelTodo('Activities')}</h3>
                </SectionWrapper>

                <SectionWrapper>
                    <ReportDetailCard
                        headline="Activity #1 name"
                        description="Physiological respiration involves the mechanisms that ensure that the composition of the functional residual capacity is kept constant."
                        items={[{ label: 'Location', text: 'Uganda, Denmark' }]}
                    />
                </SectionWrapper>
                <SectionWrapper>
                    <ChartCard
                        useBorder={true}
                        headline="Indicators"
                        items={[
                            {
                                title: 'Schools built',
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
                </SectionWrapper>
                <TextCard
                    hasBackground={true}
                    className="mt-32"
                    headline="Updates from this year"
                    body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement. "
                />
                <DividerLine />

                <SectionWrapper>
                    <ReportDetailCard
                        headline="Activity #2 name"
                        description="Physiological respiration involves the mechanisms that ensure that the composition of the functional residual capacity is kept constant."
                        items={[{ label: 'Location', text: 'Uganda, Denmark' }]}
                    />
                </SectionWrapper>
                <SectionWrapper>
                    <ChartCard
                        useBorder={true}
                        headline="Indicators"
                        items={[
                            {
                                title: 'Schools built',
                                value: '12',
                                label: 'Reached so far',
                            },
                            {
                                title: 'Wells buil',
                                value: '24',
                                label: 'Reached so far',
                            },
                        ]}
                    />
                </SectionWrapper>
                <TextCard
                    hasBackground={true}
                    className="mt-32"
                    headline="Updates from this year"
                    body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement. "
                />
            </SectionWrapper>
            {/* ------------------------------------------------------------------------------------------ */}
            {/* Sharing of results */}
            <SectionWrapper>
                <SectionWrapper>
                    <h3 className="t-h4">{labelTodo('Sharing of results')}</h3>

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
                </SectionWrapper>

                <TextCard
                    hasBackground={true}
                    headline="Description for this report"
                    body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement."
                />

                <DividerLine />

                <SectionWrapper>
                    <ReportSharingCard
                        headline="The Joe Rogan Podcast 💪"
                        label="TV/radio/film/podcast"
                        tags={[
                            'Policymakers',
                            'Politicians',
                            'Professional practitioners',
                        ]}
                    />
                </SectionWrapper>

                <TextCard
                    hasBackground={true}
                    headline="Description for this report"
                    body="In the eighteenth century the German philosopher Immanuel Kant developed a theory of knowledge in which knowledge about space can be both a priori and synthetic. According to Kant, knowledge about space is synthetic, in that statements about space are not simply true by virtue of the meaning of the words in the statement."
                />
            </SectionWrapper>

            <SectionWrapper>
                <SectionWrapper>
                    <h3 className="t-h4">{labelTodo('Loogbook entries')}</h3>
                </SectionWrapper>
                entries...
            </SectionWrapper>

            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <SectionWrapper className="bg-coral-40">
                <h2 className="t-h5">{labelTodo('To edge container')}</h2>
            </SectionWrapper>
            <SectionWrapper className="bg-teal-300">
                <SectionWrapper>
                    <h2 className="t-h5">{labelTodo('Indented container')}</h2>
                </SectionWrapper>
            </SectionWrapper>

            <SectionWrapper className="bg-amber-300">
                <SectionWrapper paddingY={false}>
                    <h2 className="t-h5">{labelTodo('No padding Y')}</h2>
                </SectionWrapper>
            </SectionWrapper>
        </>
    );
};

export async function getStaticProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    };
}

ReportComponent.propTypes = {
    pageProps: t.object,
};

ReportComponent.defaultProps = {
    pageProps: {},
};

ReportComponent.layout = 'report';

export default ReportComponent;
