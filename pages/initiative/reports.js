// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useMetadata, useAuth } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import Button from 'components/button';
import ReportCard from 'components/_report/reportCard';
import SectionWrapper from 'components/sectionWrapper';

const ReportsComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Fetch initiative data
    const { initiative } = useInitiativeDataStore();
    const [initiativeData, setInitiativeData] = useState();

    // Hook: Metadata
    const { labelTodo, label, valueSet, log } = useMetadata();

    useEffect(() => {
        console.log(initiative);
        setInitiativeData(initiative);
    }, [initiative]);

    return (
        <>
            <SectionWrapper>
                <h1 className="t-h1">Reports</h1>
            </SectionWrapper>

            {initiativeData && initiativeData._reports.length && (
                <SectionWrapper className="mt-32 bg-white rounded-8">
                    <div className="flex justify-between">
                        <h2 className="t-h3">
                            {labelTodo('Reports for Tuborg Foundation')}
                        </h2>
                        <Button
                            variant="secondary"
                            action={() => {
                                console.log('Update reports');
                                // TODO!
                                // setModalIsOpen(true);
                                // setFunder(funder);
                            }}>
                            {labelTodo('Update')}
                        </Button>
                    </div>

                    <div className="flex flex-wrap items-start">
                        {initiativeData._reports.map((item, index) => (
                            <ReportCard
                                key={`r-${index}`}
                                useBackground={false}
                                headline={'Missing data'}
                                date={item.Due_Date__c}
                                status={item.Status__c}
                                actionUpdate={() => {
                                    console.log('Update report: ', item);
                                }}
                            />
                        ))}
                    </div>
                </SectionWrapper>
            )}

            {/* <SectionWrapper className="bg-white rounded-8">
                <div className="flex justify-between">
                    <h2 className="t-h3">
                        {labelTodo('Reports for Novo Nordisk Foundation')}
                    </h2>
                    <Button
                        variant="secondary"
                        action={() => {
                            console.log('Update reports');
                            // TODO!
                            // setModalIsOpen(true);
                            // setFunder(funder);
                        }}>
                        {labelTodo('Update')}
                    </Button>
                </div>

                <div className="flex flex-wrap items-start">
                    <ReportCard
                        useBackground={false}
                        headline="Status report"
                        date="April 28th 2021"
                        status="not-started"
                        actionUpdate={() => {
                            console.log('Update report: ');
                            // setModalIsOpen(true);
                            // setUpdateId(item.id);
                            // setFunder(funder);
                        }}
                    />
                    <ReportCard
                        useBackground={false}
                        headline="Status report"
                        date="April 28th 2021"
                        status="in-progress"
                        actionUpdate={() => {
                            console.log('Update report: ');
                        }}
                    />
                    <ReportCard
                        useBackground={false}
                        headline="Status report"
                        date="April 28th 2021"
                        status="review"
                        actionUpdate={() => {
                            console.log('Update report: ');
                        }}
                    />
                    <ReportCard
                        useBackground={false}
                        headline="Status report"
                        date="April 28th 2021"
                        status="complete"
                        actionUpdate={() => {
                            console.log('Update report: ');
                        }}
                    />
                    <ReportCard
                        useBackground={false}
                        headline="Status report"
                        date="April 28th 2021"
                        status="not-started"
                        actionUpdate={() => {
                            console.log('Update report: ');
                        }}
                    />
                    <ReportCard
                        useBackground={false}
                        headline="Status report"
                        date="April 28th 2021"
                        status="in-progress"
                        actionUpdate={() => {
                            console.log('Update report: ');
                        }}
                    />
                    <ReportCard
                        useBackground={false}
                        headline="Status report"
                        date="April 28th 2021"
                        status="review"
                        actionUpdate={() => {
                            console.log('Update report: ');
                        }}
                    />
                    <ReportCard
                        useBackground={false}
                        headline="Status report"
                        date="April 28th 2021"
                        status="complete"
                        actionUpdate={() => {
                            console.log('Update report: ');
                        }}
                    />
                </div>
            </SectionWrapper>
            <SectionWrapper className="mt-32 bg-white rounded-8">
                <div className="flex justify-between">
                    <h2 className="t-h3">
                        {labelTodo('Reports for Tuborg Foundation')}
                    </h2>
                    <Button
                        variant="secondary"
                        action={() => {
                            console.log('Update reports');
                            // TODO!
                            // setModalIsOpen(true);
                            // setFunder(funder);
                        }}>
                        {labelTodo('Update')}
                    </Button>
                </div>

                <ReportCard
                    useBackground={false}
                    headline="Status report"
                    date="April 28th 2021"
                    status="review"
                    actionUpdate={() => {
                        console.log('Update report: ');
                    }}
                />
            </SectionWrapper> */}
        </>
    );
};

export async function getStaticProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    };
}

ReportsComponent.propTypes = {
    pageProps: t.object,
};

ReportsComponent.defaultProps = {
    pageProps: {},
};

ReportsComponent.layout = 'initiative';

export default ReportsComponent;
