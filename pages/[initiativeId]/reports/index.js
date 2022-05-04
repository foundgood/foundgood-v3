// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useLabels, useAuth } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import Preloader from 'components/preloader';
import UpdateButton from 'components/updateButton';
import Footer from 'components/_layout/footer';
import ReportCard from 'components/_initiative/reportCard';
import SectionWrapper from 'components/sectionWrapper';
import SectionEmpty from 'components/sectionEmpty';

const ReportsComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { user, verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Fetch initiative data
    const { initiative, CONSTANTS } = useInitiativeDataStore();
    const [reportGroups, setReportGroups] = useState();

    // Hook: Metadata
    const { label } = useLabels();

    useEffect(() => {
        if (
            user?.user_id &&
            initiative?.Id &&
            Object.keys(initiative?._funders).length > 0
        ) {
            filterReports();
        }
        // Set empty state
        else if (
            initiative?.Id &&
            Object.keys(initiative?._funders).length < 1
        ) {
            setReportGroups([]);
        }
    }, [user, initiative]);

    const filterReports = async () => {
        // Group reports by funder
        const funders = Object.values(initiative._funders).map(item => {
            // Get reports
            const reports = Object.values(initiative._reports).filter(
                report => {
                    // If account type is 'Foundation'
                    // Only show reports related to users accountId
                    if (
                        user.User_Account_Type__c ===
                        CONSTANTS.ACCOUNT.ACCOUNT_TYPE_FOUNDATION
                    ) {
                        return (
                            report.Funder_Report__c == item.Id &&
                            user.AccountId ==
                                report.Funder_Report__r.Account__r.Id
                        );
                    }
                    // Show all funders reports
                    else {
                        return report.Funder_Report__c == item.Id;
                    }
                }
            );

            return { ...item, ...{ reports: reports } };
        });
        // Filter out funders without reports
        const reports = funders.filter(funder => {
            return funder.reports.length > 0;
        });
        setReportGroups(reports);
    };

    // Is NNF only founder
    const isOnlyNNF =
        reportGroups?.length === 1 &&
        reportGroups[0]?.Account__c === CONSTANTS.IDS.NNF_ACCOUNT;

    return (
        <>
            {/* Preloading - Show loading */}
            {!initiative?.Id && <Preloader hasBg={true} />}

            {/* Data Loaded - Show initiative */}
            {initiative?.Id && (
                <div className="animate-fade-in">
                    <SectionWrapper>
                        <div className="flex justify-between">
                            <h1 className="t-h1">
                                {label('InitiativeViewReportsScheduleHeading')}
                            </h1>
                            {reportGroups?.length < 1 && !isOnlyNNF && (
                                <UpdateButton
                                    mode="initiative"
                                    baseUrl="report-schedule"
                                    variant="primary"
                                />
                            )}
                        </div>
                    </SectionWrapper>
                    {reportGroups?.length > 0 &&
                        reportGroups?.map((item, index) => (
                            <SectionWrapper
                                key={`r-${index}`}
                                className="mt-32 bg-white rounded-8">
                                <div className="flex justify-between">
                                    <h2 className="t-h3">
                                        {item.Account__r.Name}
                                    </h2>
                                    {item.Account__c !==
                                        CONSTANTS.IDS.NNF_ACCOUNT && (
                                        <UpdateButton
                                            mode="initiative"
                                            baseUrl="report-schedule"
                                        />
                                    )}
                                </div>

                                <div className="flex flex-wrap">
                                    {item.reports
                                        .sort(
                                            (a, b) =>
                                                new Date(a.Due_Date__c) -
                                                new Date(b.Due_Date__c)
                                        )
                                        .map((item, index) => {
                                            const headline =
                                                item.Report_Viewer_Version__c ==
                                                '1'
                                                    ? 'Report'
                                                    : item.Report_Type__c;
                                            const date = item.Due_Date__c;
                                            return (
                                                <ReportCard
                                                    key={`r-${index}`}
                                                    id={item.Id}
                                                    useBackground={false}
                                                    headline={headline}
                                                    date={date}
                                                    status={item.Status__c}
                                                />
                                            );
                                        })}
                                </div>
                            </SectionWrapper>
                        ))}
                    {/* Empty state - No reports */}
                    {reportGroups?.length < 1 && (
                        <SectionEmpty type="initiative" />
                    )}
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

ReportsComponent.propTypes = {
    pageProps: t.object,
};

ReportsComponent.defaultProps = {
    pageProps: {},
};

ReportsComponent.layout = 'initiative';

export default ReportsComponent;
