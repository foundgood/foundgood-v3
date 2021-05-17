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
    const [reportGroups, setReportGroups] = useState();

    // Hook: Metadata
    const { labelTodo, label, valueSet, log } = useMetadata();

    useEffect(() => {
        // console.log(initiative);

        // Group reports by funder
        const funders = Object.values(initiative._funders).map(item => {
            // Get reports
            const reports = Object.values(initiative._reports).filter(
                report => report.Funder_Report__c == item.Id
            );
            return { ...item, ...{ reports: reports } };
        });
        // Filter out funders without reports
        const reports = funders.filter(funder => {
            return funder.reports.length > 0;
        });
        setReportGroups(reports);
    }, [initiative]);

    return (
        <>
            <SectionWrapper>
                <h1 className="t-h1">Reports</h1>
            </SectionWrapper>

            {reportGroups &&
                reportGroups.map((item, index) => (
                    <SectionWrapper
                        key={`r-${index}`}
                        className="mt-32 bg-white rounded-8">
                        <div className="flex justify-between">
                            <h2 className="t-h3">{item.Translated_Type__c}</h2>
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

                        <div className="flex flex-wrap">
                            {item.reports.map((item, index) => {
                                const headline =
                                    item.Report_Viewer_Version__c == '1'
                                        ? labelTodo('Report')
                                        : item.Report_Type__c;
                                const date = item.Due_Date__c;
                                return (
                                    <ReportCard
                                        key={`r-${index}`}
                                        useBackground={false}
                                        headline={headline}
                                        date={date}
                                        status={item.Status__c}
                                        actionUpdate={() => {
                                            console.log(
                                                'Update report: ',
                                                item
                                            );
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </SectionWrapper>
                ))}
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
