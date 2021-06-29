// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Components
import SectionWrapper from 'components/sectionWrapper';

// Report sections

import Preloader from 'components/preloader';
import Footer from 'components/_layout/footer';
import ReportHeader from 'components/_report/templates/report_1_1/reportHeader';
import ReportOverview from 'components/_report/templates/report_1_1/reportOverview';
import ReportSummary from 'components/_report/templates/report_1_1/reportSummary';
import ReportGoals from 'components/_report/templates/report_1_1/reportGoals';
import ReportFunders from 'components/_report/templates/report_1_1/reportFunders';
import ReportApplicants from 'components/_report/templates/report_1_1/reportApplicants';
import ReportCollaborators from 'components/_report/templates/report_1_1/reportCollaborators';
import ReportEmployeesFunded from 'components/_report/templates/report_1_1/reportEmployeesFunded';
import ReportActivities from 'components/_report/templates/report_1_1/reportActivities';
import ReportResults from 'components/_report/templates/report_1_1/reportResults';
import ReportInfluences from 'components/_report/templates/report_1_1/reportInfluences';
import ReportEvaluations from 'components/_report/templates/report_1_1/reportEvaluations';
import ReportReflection from 'components/_report/templates/report_1_1/reportReflection';

const Report_1_1Component = ({ initiative, report, CONSTANTS }) => {
    // Hook: Metadata
    const { label } = useMetadata();

    const [initiativeData, setInitiativeData] = useState();
    const [currentReport, setCurrentReport] = useState([]);

    useEffect(() => {
        // Initial Load
        if (report?.Id && initiative?.Id) {
            // console.log('report: ', report);
            // console.log('initiative: ', initiative);

            setCurrentReport(report);
            setInitiativeData(initiative);
        }
    }, [initiative]);

    return (
        <>
            {/* Preloading - Show loading */}
            {!initiativeData && <Preloader />}

            {/* Data Loaded - Show report */}
            {initiativeData && (
                <div className="animate-fade-in">
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Header */}
                    <ReportHeader
                        initiative={initiativeData}
                        report={currentReport}
                        constants={CONSTANTS}
                    />
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Overview */}
                    <ReportOverview
                        initiative={initiativeData}
                        report={currentReport}
                        constants={CONSTANTS}
                    />
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Goals */}
                    <ReportGoals
                        initiative={initiativeData}
                        report={currentReport}
                        constants={CONSTANTS}
                    />
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Report Summary */}
                    <ReportSummary
                        initiative={initiativeData}
                        report={currentReport}
                        constants={CONSTANTS}
                    />

                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Headline: "Key changes" */}
                    <SectionWrapper paddingY={false}>
                        <h2 className="t-h3 mt-96">
                            {label('custom.FA_ReportViewHeadingKeyChanges')}
                        </h2>
                    </SectionWrapper>

                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Activities */}
                    {currentReport?.Report_Type__c !== 'Status' && (
                        <ReportActivities
                            initiative={initiativeData}
                            report={currentReport}
                            constants={CONSTANTS}
                        />
                    )}

                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Funders */}
                    <ReportFunders
                        initiative={initiativeData}
                        report={currentReport}
                        constants={CONSTANTS}
                    />

                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Applicants */}
                    {currentReport?.Report_Type__c === 'Status' && (
                        <ReportApplicants
                            initiative={initiativeData}
                            report={currentReport}
                            constants={CONSTANTS}
                        />
                    )}

                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Collaborators */}
                    <ReportCollaborators
                        initiative={initiativeData}
                        report={currentReport}
                        constants={CONSTANTS}
                    />
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Employees funded by the grant */}
                    {currentReport?.Report_Type__c !== 'Status' && (
                        <ReportEmployeesFunded
                            initiative={initiativeData}
                            report={currentReport}
                            constants={CONSTANTS}
                        />
                    )}

                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Logbook entries - TBD */}
                    {/*
                    <SectionWrapper>
                        <SectionWrapper>
                            <h3 className="mt-32 t-h4">
                                {labelTodo('Loogbook entries')}
                            </h3>
                        </SectionWrapper>
                        entries...
                    </SectionWrapper>
                    */}
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Headline: "Key results" */}
                    {currentReport?.Report_Type__c !== 'Status' && (
                        <SectionWrapper paddingY={false}>
                            <SectionWrapper paddingY={false}>
                                <h2 className="t-h3 mt-96">
                                    {label(
                                        'custom.FA_ReportViewHeadingKeyResults'
                                    )}
                                </h2>
                            </SectionWrapper>
                        </SectionWrapper>
                    )}
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Outcomes TBD */}
                    {/* {outcomes && (
                        <SectionWrapper>
                            <SectionWrapper>
                                <h3 className="mt-32 t-h4">
                                    {labelTodo('Outcomes')}
                                </h3>
                            </SectionWrapper>
                            {outcomes.map((item, index) => (
                                <p key={`o-${index}`}>Outcome {index}</p>
                            ))}
                        </SectionWrapper>
                    )} */}
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Sharing of results */}
                    {currentReport?.Report_Type__c !== 'Status' && (
                        <ReportResults
                            initiative={initiativeData}
                            report={currentReport}
                            constants={CONSTANTS}
                        />
                    )}
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Influences on policy */}
                    {currentReport?.Report_Type__c !== 'Status' && (
                        <ReportInfluences
                            initiative={initiativeData}
                            report={currentReport}
                            constants={CONSTANTS}
                        />
                    )}
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Evaluations */}
                    {currentReport?.Report_Type__c !== 'Status' && (
                        <ReportEvaluations
                            initiative={initiativeData}
                            report={currentReport}
                            constants={CONSTANTS}
                        />
                    )}
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Reflections */}
                    {currentReport?.Report_Type__c !== 'Status' &&
                        currentReport?.Report_Type__c !== 'Annual' && (
                            <ReportReflection
                                initiative={initiativeData}
                                report={currentReport}
                                constants={CONSTANTS}
                            />
                        )}

                    {/* Todo - Implement + wrap in component */}
                    {/* Post project activities */}
                    {/* {report.Post_Project_Activities__c && (
                        <SectionWrapper>
                            <TextCard
                                className="mt-32"
                                hasBackground={true}
                                headline={label(
                                    'objects.initiativeReport.Post_Project_Activities__c'
                                )}
                                body={report.Post_Project_Activities__c}
                            />
                        </SectionWrapper>
                    )} */}
                    {/* Empty state - Post project activities */}
                    {/* {!report.Post_Project_Activities__c && (
                        <SectionWrapper>
                            <SectionEmpty
                                type="report"
                                headline={label(
                                    'objects.initiativeReport.Post_Project_Activities__c'
                                )}
                            />
                        </SectionWrapper>
                    )} */}
                    {/* Additional Info */}
                    <SectionWrapper>
                        <SectionWrapper>
                            <h3 className="mt-32 t-h4">
                                {label(
                                    'custom.FA_ReportViewSubHeadingLogAdditional'
                                )}
                            </h3>
                            <p className="mt-32 t-small">
                                {label(
                                    'custom.FA_ReportViewSubHeadingLogAdditionalSubHeading'
                                )}
                            </p>
                        </SectionWrapper>
                    </SectionWrapper>

                    <Footer />
                </div>
            )}
        </>
    );
};

Report_1_1Component.propTypes = {
    initiative: t.object.isRequired,
    report: t.object.isRequired,
    CONSTANTS: t.object.isRequired,
};

Report_1_1Component.defaultProps = {
    report: {},
};

export default Report_1_1Component;
