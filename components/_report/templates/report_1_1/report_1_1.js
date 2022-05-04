// React
import React, { useEffect, useState } from 'react';

// Next
import Link from 'next/link';

// Packages
import t from 'prop-types';

// Utilities
import { useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

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

const Report_1_1Component = ({ initiativeData = {}, reportData = {} }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { CONSTANTS: constants } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label } = useLabels();

    // ///////////////////
    // STATE
    // ///////////////////

    const [initiative, setInitiative] = useState({});
    const [report, setReport] = useState({});

    // ///////////////////
    // EFFECTS
    // ///////////////////

    // Initial Load
    useEffect(() => {
        if (initiativeData?.Id && reportData?.Id) {
            setInitiative(initiativeData);
            setReport(reportData);
        }
    }, [initiativeData]);

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <>
            {/* Preloading - Show loading */}
            {!initiative && <Preloader />}

            {/* Data Loaded - Show report */}
            {initiative && (
                <div className="animate-fade-in">
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Header */}
                    <ReportHeader {...{ initiative, report, constants }} />
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Overview */}
                    <ReportOverview {...{ initiative, report, constants }} />
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Goals */}
                    {/* <ReportGoals
                        {...{ initiative, report, constants }}
                    /> */}
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Report Summary */}
                    <ReportSummary {...{ initiative, report, constants }} />

                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Headline: "Key changes" */}
                    <SectionWrapper paddingY={false}>
                        <h2 className="t-h3 mt-96">
                            {label('ReportViewHeadingKeyChanges')}
                        </h2>
                    </SectionWrapper>

                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Activities */}
                    {report?.Report_Type__c !== 'Status' && (
                        <ReportActivities
                            {...{ initiative, report, constants }}
                        />
                    )}

                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Funders */}
                    <ReportFunders {...{ initiative, report, constants }} />

                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Applicants */}
                    {report?.Report_Type__c === 'Status' && (
                        <ReportApplicants
                            {...{ initiative, report, constants }}
                        />
                    )}

                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Collaborators */}
                    <ReportCollaborators
                        {...{ initiative, report, constants }}
                    />
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Employees funded by the grant */}
                    {report?.Report_Type__c !== 'Status' && (
                        <ReportEmployeesFunded
                            {...{ initiative, report, constants }}
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
                    {report?.Report_Type__c !== 'Status' && (
                        <SectionWrapper paddingY={false}>
                            <SectionWrapper paddingY={false}>
                                <h2 className="t-h3 mt-96">
                                    {label('ReportViewHeadingKeyResults')}
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
                    {report?.Report_Type__c !== 'Status' && (
                        <ReportResults {...{ initiative, report, constants }} />
                    )}
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Influences on policy */}
                    {report?.Report_Type__c !== 'Status' && (
                        <ReportInfluences
                            {...{ initiative, report, constants }}
                        />
                    )}
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Evaluations */}
                    {report?.Report_Type__c !== 'Status' && (
                        <ReportEvaluations
                            {...{ initiative, report, constants }}
                        />
                    )}
                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Reflections */}
                    {report?.Report_Type__c !== 'Status' &&
                        report?.Report_Type__c !== 'Annual' && (
                            <ReportReflection
                                {...{
                                    initiative,
                                    report,
                                    constants,
                                }}
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
                                    'objects.Initiative__c.Post_Project_Activities__c'
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
                                    'objects.Initiative__c.Post_Project_Activities__c'
                                )}
                            />
                        </SectionWrapper>
                    )} */}
                    {/* Additional Info */}
                    <SectionWrapper>
                        <SectionWrapper>
                            <h3 className="mt-32 t-h4">
                                {label('ReportViewSubHeadingLogAdditional')}
                            </h3>
                            <p className="mt-32 t-small">
                                <Link href={`/${initiative.Id}/logbook`}>
                                    <a className="underline">
                                        {label(
                                            'ReportViewSubHeadingLogAdditionalSubHeading'
                                        )}
                                    </a>
                                </Link>
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
    constants: t.object.isRequired,
};

Report_1_1Component.defaultProps = {
    report: {},
};

export default Report_1_1Component;
