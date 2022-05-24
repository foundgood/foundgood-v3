// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { getPermissionRules } from 'utilities';
import { useLabels, useUser } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import WithAuth from 'components/withAuth';
import Preloader from 'components/preloader';
import UpdateButton from 'components/updateButton';
import Footer from 'components/_layout/footer';
import ReportCard from 'components/_initiative/reportCard';
import SectionWrapper from 'components/sectionWrapper';
import SectionEmpty from 'components/sectionEmpty';

const ReportsComponent = ({ pageProps }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { initiative, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { getUserAccountId, getUserAccountType } = useUser();
    const { label } = useLabels();

    // ///////////////////
    // STATE
    // ///////////////////

    const [reportGroups, setReportGroups] = useState();

    // ///////////////////
    // EFFECTS
    // ///////////////////

    useEffect(() => {
        if (initiative?.Id && Object.keys(initiative?._funders).length > 0) {
            filterReports();
        }
        // Set empty state
        else if (
            initiative?.Id &&
            Object.keys(initiative?._funders).length < 1
        ) {
            setReportGroups([]);
        }
    }, [initiative]);

    const filterReports = async () => {
        // Group reports by funder
        const funders = Object.values(initiative._funders).map(item => {
            // Get reports
            const reports = Object.values(initiative._reports).filter(
                report => {
                    // If account type is 'Foundation'
                    // Only show reports related to users accountId
                    if (
                        getUserAccountType() ===
                        CONSTANTS.ACCOUNT.ACCOUNT_TYPE_FOUNDATION
                    ) {
                        return (
                            report.Funder_Report__c == item.Id &&
                            getUserAccountId() ==
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
                            <UpdateButton
                                {...{
                                    baseUrl: 'report-schedule',
                                    rules: getPermissionRules(
                                        'initiative',
                                        'reportSchedule',
                                        'update'
                                    ),
                                    variant: 'primary',
                                }}
                            />
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
                                    <UpdateButton
                                        {...{
                                            baseUrl: 'report-schedule',
                                            rules: getPermissionRules(
                                                'initiative',
                                                'reportSchedule',
                                                'update'
                                            ),
                                        }}
                                    />
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

export default WithAuth(ReportsComponent);
