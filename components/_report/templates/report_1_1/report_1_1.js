// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Components
import SectionWrapper from 'components/sectionWrapper';

// Report sections
import ReportHeader from './reportHeader';
import ReportOverview from './reportOverview';
import ReportSummary from './reportSummary';
import ReportGoals from './reportGoals';
import ReportFunders from './reportFunders';
import ReportApplicants from './reportApplicants';
import ReportCollaborators from './reportCollaborators';
import ReportEmployeesFunded from './reportEmployeesFunded';
import ReportActivities from './reportActivities';
import ReportResults from './reportResults';
import ReportInfluences from './reportInfluences';
import ReportEvaluations from './reportEvaluations';
import ReportReflection from './reportReflection';

const Report_1_1Component = ({ initiative, report, CONSTANTS }) => {
    // Hook: Metadata
    const { label } = useMetadata();

    const [initiativeData, setInitiativeData] = useState();
    const [currentReport, setCurrentReport] = useState([]);

    useEffect(() => {
        // Initial Load
        if (report?.Id && initiative?.Id) {
            console.log('report: ', report);
            console.log('initiative: ', initiative);

            setCurrentReport(report);
            setInitiativeData(initiative);
        }
    }, [initiative]);

    return (
        <>
            {initiativeData && (
                <>
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
                    {/* Report Summary */}
                    <ReportSummary
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
                    {/* Funders */}
                    <ReportFunders
                        initiative={initiativeData}
                        report={currentReport}
                        constants={CONSTANTS}
                    />

                    {/* ------------------------------------------------------------------------------------------ */}
                    {/* Applicants */}
                    <ReportApplicants
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
                    {/* Activities */}
                    {currentReport?.Report_Type__c !== 'Status' && (
                        <ReportActivities
                            initiative={initiativeData}
                            report={currentReport}
                            constants={CONSTANTS}
                        />
                    )}
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
                </>
            )}
        </>
    );
};

Report_1_1Component.propTypes = {
    initiative: t.object.isRequired,
    report: t.object.isRequired,
    CONSTANTS: t.object.isRequired,
};

Report_1_1Component.defaultProps = {};

export default Report_1_1Component;
