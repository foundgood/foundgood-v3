// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { asId, getPermissionRules } from 'utilities';
import { useLabels } from 'utilities/hooks';

// Components
import SectionWrapper from 'components/sectionWrapper';
import SectionEmpty from 'components/sectionEmpty';
import UpdateButton from 'components/updateButton';
import TextCard from 'components/_initiative/textCard';

const ReportSummaryComponent = ({ report }) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label, object } = useLabels();

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <SectionWrapper id={asId(label('ReportWizardMenuSummary'))}>
            <SectionWrapper>
                <div className="flex justify-between mt-32">
                    <h3 className="t-h4">
                        {label('ReportViewHeadingSummary')}
                    </h3>
                    <UpdateButton mode="report" baseUrl="" />
                    <UpdateButton
                        {...{
                            context: 'report',
                            baseUrl: 'report-summary',
                            rules: getPermissionRules(
                                'report',
                                'reportSummary',
                                'update'
                            ),
                        }}
                    />
                </div>
            </SectionWrapper>

            {/* Overall performance */}
            {report.Summary_Of_Activities__c ? (
                <TextCard
                    hasBackground={true}
                    headline={object.label(
                        'Initiative__c.Summary_Of_Activities__c'
                    )}
                    body={report.Summary_Of_Activities__c}
                />
            ) : (
                <SectionEmpty
                    type="report"
                    headline={object.label(
                        'Initiative__c.Summary_Of_Activities__c'
                    )}
                />
            )}

            {/* No Challenges and learnings */}
            {report.Summary_Of_Challenges_And_Learnings__c ? (
                <TextCard
                    hasBackground={true}
                    className="mt-32"
                    headline={object.label(
                        'Initiative__c.Summary_Of_Challenges_And_Learnings__c'
                    )}
                    body={report.Summary_Of_Challenges_And_Learnings__c}
                />
            ) : (
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
    report: t.object.isRequired,
};

ReportSummaryComponent.defaultProps = {};

export default ReportSummaryComponent;
