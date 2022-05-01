// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useLabels } from 'utilities/hooks';
import { asId } from 'utilities';

// Components
import SectionWrapper from 'components/sectionWrapper';
import SectionEmpty from 'components/sectionEmpty';
import UpdateButton from 'components/updateButton';
import TextCard from 'components/_initiative/textCard';

const ReportSummaryComponent = ({ initiative, report, constants }) => {
    // Hook: Metadata
    const { label, object } = useLabels();

    // useEffect(() => {
    // }, []);

    return (
        <SectionWrapper id={asId(label('ReportWizardMenuSummary'))}>
            <SectionWrapper>
                <div className="flex justify-between mt-32">
                    <h3 className="t-h4">
                        {label('ReportViewHeadingSummary')}
                    </h3>
                    <UpdateButton mode="report" baseUrl="report-summary" />
                </div>
            </SectionWrapper>
            {/* Overall perfomance */}
            {report.Summary_Of_Activities__c && (
                <TextCard
                    hasBackground={true}
                    headline={object.label(
                        'Initiative__c.Summary_Of_Activities__c'
                    )}
                    body={report.Summary_Of_Activities__c}
                />
            )}
            {/* Empty state - No Overall perfomance */}
            {!report.Summary_Of_Activities__c && (
                <SectionEmpty
                    type="report"
                    headline={object.label(
                        'Initiative__c.Summary_Of_Activities__c'
                    )}
                />
            )}

            {report.Summary_Of_Challenges_And_Learnings__c && (
                <TextCard
                    hasBackground={true}
                    className="mt-32"
                    headline={object.label(
                        'Initiative__c.Summary_Of_Challenges_And_Learnings__c'
                    )}
                    body={report.Summary_Of_Challenges_And_Learnings__c}
                />
            )}
            {/* Empty state - No Overall perfomance */}
            {!report.Summary_Of_Challenges_And_Learnings__c && (
                <SectionEmpty
                    type="report"
                    headline={object.label(
                        'Initiative__c.Summary_Of_Challenges_And_Learnings__c'
                    )}
                />
            )}
        </SectionWrapper>
    );
};

ReportSummaryComponent.propTypes = {
    initiative: t.object.isRequired,
    report: t.object.isRequired,
    constants: t.object.isRequired,
};

ReportSummaryComponent.defaultProps = {};

export default ReportSummaryComponent;
